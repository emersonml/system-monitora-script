import { useEffect } from 'react';

import { FaCameraRetro, FaCar, FaShieldAlt, FaUserFriends } from 'react-icons/fa';
import { HiVariable } from 'react-icons/hi';
import { IoMdSettings } from 'react-icons/io';
import { IoBusiness } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import { MdCameraAlt, MdDashboard, MdVerifiedUser } from 'react-icons/md';

import CamApi from '@services/Api/CamApi';
import useAuthState, { User } from '@states/AuthState';
import { createInitialState, createState } from '@states/index';
import useTranslationState from '@states/TranslationState';
import { MENU_AUDIT, MENU_DASHBOARD, MENU_SETTINGS } from '@utils/Environment';

export type Menu = {
    visible: boolean;
    title: string;
    Icon: IconType;
    url?: string;
    subMenus?: SubMenu[];
};

export type SubMenu = {
    visible: boolean;
    title: string;
    Icon: IconType;
    url?: string;
    subMenus?: SubMenu[];
};

type MenuState = {
    visible: boolean;
    expanded: boolean;
    menus: Menu[];
};

const INITIAL_STATE = createInitialState<MenuState>({
    visible: false,
    expanded: false,
    menus: []
});

export const DEFAULT_URLS = ['/profile'];

export default function useMenuState() {
    const [state, setState] = createState(INITIAL_STATE);

    const authState = useAuthState();
    const { translation } = useTranslationState();

    const showSubMenus = (subMenus: SubMenu[]) =>
        subMenus.filter(subMenu => {
            if (subMenu.visible) {
                if (subMenu.subMenus) {
                    subMenu.subMenus = showSubMenus(subMenu.subMenus);
                    return subMenu.subMenus.length > 0;
                }
            }

            return subMenu.visible;
        });

    useEffect(() => {
        (async () => {
            const menus = await getMenus();
            setState(state => {
                state.menus = menus;
            });
        })();
    }, [authState.user]);

    function toggle() {
        setState(state => {
            state.visible = !state.visible;
            state.expanded = !!state.visible;
        });
    }

    function toggleExpanded() {
        setState(state => {
            state.expanded = !state.expanded;
        });
    }

    function setVisible(visible: boolean) {
        setState(state => {
            state.visible = visible;
        });
    }

    async function getMenus(user?: User) {
        if (!user) {
            user = authState.user;
        }

        const companyId = user?.companyId;
        let externalMenus: SubMenu[] = [];
        if (user?.id) {
            const cameras = await CamApi.listWithPromise({ companyId });
            externalMenus = cameras.list.map(camera => ({
                visible: true,
                title: camera.name,
                Icon: MdCameraAlt,
                url: `/cameras/view?id=${camera?.id}`
            }));
        }

        const menus: Menu[] = [
            {
                visible: MENU_DASHBOARD && authState.can(['menu_dashboard'], user),
                title: translation('Painel'),
                Icon: MdDashboard,
                url: '/dashboard'
            },
            {
                visible: true,
                title: 'Câmeras Disponíveis',
                Icon: MdCameraAlt,
                subMenus: [...externalMenus]
            },
            {
                visible: authState.can(['user_view'], user),
                title: translation('Empresas'),
                Icon: IoBusiness,
                url: '/companies'
            },
            {
                visible: authState.can(['user_view'], user),
                title: translation('Gestão Câmeras'),
                Icon: FaCameraRetro,
                url: '/cameras'
            },
            {
                visible: authState.can(['user_view'], user),
                title: translation('Veículos'),
                Icon: FaCar,
                url: '/places'
            },
            {
                visible: MENU_AUDIT && authState.can(['menu_audit'], user),
                title: translation('Auditoria'),
                Icon: MdVerifiedUser,
                url: '/audits'
            },
            {
                visible: MENU_SETTINGS && authState.can(['menu_settings'], user),
                title: translation('Administração'),
                Icon: IoMdSettings,
                subMenus: [
                    {
                        visible: authState.can(['user_view'], user),
                        title: translation('Usuários'),
                        Icon: FaUserFriends,
                        url: '/users'
                    },
                    {
                        visible: authState.can(['permission_view'], user),
                        title: translation('Perfis/Funções'),
                        Icon: FaShieldAlt,
                        url: '/roles'
                    },
                    {
                        visible: authState.can(['permission_view'], user),
                        title: translation('Permissões'),
                        Icon: FaShieldAlt,
                        url: '/permissions'
                    },
                    {
                        visible: authState.can(['environment_view'], user),
                        title: translation('Variáveis'),
                        Icon: HiVariable,
                        url: '/environments'
                    }
                ]
            }
        ];

        return menus.filter(menu => {
            if (menu.visible) {
                if (menu.subMenus) {
                    menu.subMenus = showSubMenus(menu.subMenus);
                    return menu.subMenus.length > 0;
                }
            }

            return menu.visible;
        });
    }

    async function getUrls(user?: User) {
        const urls = (await getMenus(user))
            .map(menu => {
                const urls: string[] = [];

                if (menu.url) {
                    urls.push(menu.url);
                }

                if (menu.subMenus) {
                    for (const subMenu of menu.subMenus) {
                        if (subMenu.url) {
                            urls.push(subMenu.url);
                        }
                    }
                }

                return urls;
            })
            .flat();

        return urls;
    }

    function setExpanded(expanded: boolean) {
        setState(state => {
            state.expanded = expanded;
        });
    }

    return {
        ...state,
        toggle,
        setVisible,
        getMenus,
        getUrls,
        setExpanded,
        toggleExpanded
    };
}
