import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Menu as AntdMenu, Avatar, Drawer, Dropdown } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled, { css } from 'styled-components';

import useMediaQuery from '@hooks/MediaQuery';
import useSession from '@hooks/Session';
import useAuthState from '@states/AuthState';
import useMenuState from '@states/MenuState';
import useTranslationState from '@states/TranslationState';
import { PRIMARY_COLOR } from '@utils/Environment';
import Storage from '@utils/Storage';

const OPENED_MENUS_KEY = 'openedMenus';

export default function Menu() {
    const authState = useAuthState();
    const menuState = useMenuState();
    const { translation } = useTranslationState();

    const [openedMenus, setOpenedMenus] = useState(Storage.get<string[]>(OPENED_MENUS_KEY, []));
    const [selectedSubMenu, setSelectedSubMenu] = useState('');

    const router = useRouter();
    const showDrawerMenu = useMediaQuery('max-width: 1000px');

    const session = useSession();
    const url = router.pathname;

    useEffect(() => {
        if (!showDrawerMenu) {
            menuState.setVisible(false);
        }

        if (url === '/dashboard' && !menuState.visible) menuState.setExpanded(false);
        if (url !== '/dashboard') menuState.setExpanded(true);
    }, [showDrawerMenu]);

    const primaryColor = PRIMARY_COLOR.replace('#', '');

    const userName = authState?.user?.name || '';
    const latName = userName?.split(' ');
    const name = latName?.[0] || 'NAME';
    const avatarUrl = `https://ui-avatars.com/api/?name=${name}&bold=true&background=f1f2f3&color=${primaryColor}`;

    function handleProfile() {
        router.push('/profile');
    }

    function handleLogout() {
        session.logout();
    }

    function handleMenuClick(url: string, isMenu: boolean) {
        if (isMenu) {
            Storage.set(OPENED_MENUS_KEY, []);
        }

        if (url != router.pathname) {
            router.push(url);
        }
    }

    function handleOpenMenuChange(openedMenus: string[]) {
        Storage.set(OPENED_MENUS_KEY, openedMenus);
        setOpenedMenus(openedMenus);
    }

    function handleDrawerClose() {
        menuState.toggle();
    }

    const handleMouseEnter = () => {
        if (!menuState.expanded) {
            menuState.setExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (menuState.expanded) {
            menuState.setExpanded(false);
        }
    };

    const renderMenuItem = menuItem => {
        if (menuItem.subMenus) {
            return (
                <AntdMenu.SubMenu key={menuItem.title} icon={<menuItem.Icon size={16} />} title={menuItem.title}>
                    {menuItem.subMenus.map(subMenuItem => renderMenuItem(subMenuItem))}
                </AntdMenu.SubMenu>
            );
        }
        return (
            <AntdMenu.Item
                key={menuItem.url}
                icon={<menuItem.Icon size={16} />}
                onClick={() => handleMenuClick(`${menuItem.url}`, false)}>
                {menuItem.title}
            </AntdMenu.Item>
        );
    };

    useEffect(() => {
        let openedMenu = '';
        let selectedSubMenu = '';

        function checkUrl(urlMenu: string, url: string) {
            return urlMenu == url || urlMenu == url.replace(/\/\[.+\]$/i, '');
        }

        root: for (const menu of menuState.menus) {
            if (menu.subMenus) {
                for (const subMenu of menu.subMenus) {
                    if (checkUrl(subMenu.url, url)) {
                        openedMenu = menu.title;
                        selectedSubMenu = subMenu.url;
                        break root;
                    }
                    if (subMenu.subMenus) {
                        for (const subSubMenu of subMenu.subMenus) {
                            if (checkUrl(subSubMenu.url, url)) {
                                openedMenu = menu.title;
                                selectedSubMenu = subSubMenu.url;
                                break root;
                            }
                        }
                    }
                }
            } else if (checkUrl(menu.url, url)) {
                selectedSubMenu = menu.title;
                break;
            }
        }

        setSelectedSubMenu(selectedSubMenu);
        handleOpenMenuChange([openedMenu]);
    }, [url, menuState.menus]);

    const container = (
        <Container
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            $isImportant={menuState.expanded}
            trigger={null}
            collapsible
            collapsed={!menuState.expanded}>
            <UserInfo
                overlay={
                    <AntdMenu>
                        <AntdMenu.Item key="profile" icon={<FiUser size={16} />} onClick={handleProfile}>
                            {translation('Perfil')}
                        </AntdMenu.Item>
                        <AntdMenu.Item key="logout" icon={<FiLogOut size={16} />} onClick={handleLogout}>
                            {translation('Sair')}
                        </AntdMenu.Item>
                    </AntdMenu>
                }
                trigger={['click']}>
                <div>
                    <Avatar src={avatarUrl} size="large" />

                    {menuState.expanded && (
                        <a>
                            {name} <MdKeyboardArrowDown size={18} />
                        </a>
                    )}
                </div>
            </UserInfo>

            <AntdMenu
                mode="inline"
                theme="dark"
                openKeys={openedMenus}
                selectedKeys={[selectedSubMenu]}
                onOpenChange={handleOpenMenuChange}>
                {menuState.menus.map(menuItem => renderMenuItem(menuItem))}
            </AntdMenu>
        </Container>
    );

    if (showDrawerMenu) {
        return (
            <DrawerMenu visible={menuState.visible} placement="left" closable={false} onClose={handleDrawerClose}>
                {container}
            </DrawerMenu>
        );
    }

    return container;
}

const Container = styled(Sider)<{ $isImportant: boolean }>`
    grid-area: Menu;
    display: flex;
    flex-direction: column;
    background: #000c17;
    width: 270px;

    overflow-y: auto;

    overflow-x: hidden !important;
    height: 100vh;

    ${props =>
        props.$isImportant
            ? css`
                  min-width: 270px !important;
              `
            : ''}

    > ul {
        overflow: auto;
    }
`;

const UserInfo = styled(Dropdown)`
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 64px;
    flex-shrink: 0;

    :hover {
        cursor: pointer;
    }

    a {
        display: flex;
        align-items: center;
        margin-left: 16px;
        color: #ffffff;
        font-size: 12pt;

        svg {
            margin-left: 4px;
        }

        :hover {
            filter: brightness(0.8);
        }
    }
`;

const DrawerMenu = styled(Drawer)`
    .ant-drawer-content-wrapper {
        width: 270px !important;

        .ant-drawer-body {
            background: #000c17;
            padding: 0 !important;
        }
    }
`;
