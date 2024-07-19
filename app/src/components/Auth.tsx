import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect, useState } from 'react';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import styled from 'styled-components';

import NotFoundPage from '@pages/404';
import Api from '@services/Api';
import useAuthState, { User } from '@states/AuthState';
import useLoadingState from '@states/LoadingState';
import useMenuState, { DEFAULT_URLS } from '@states/MenuState';
import { TOKEN_KEY } from '@utils/Constant';
import Storage from '@utils/Storage';
import Token from '@utils/Token';

type Props = {
    children: ReactNode;
};

export default function Auth({ children }: Props) {
    const loadingState = useLoadingState();
    const authState = useAuthState();
    const menuState = useMenuState();

    const router = useRouter();

    const [showContent, setShowContent] = useState(false);
    const [show404, setShow404] = useState(false);

    useEffect(() => {
        (async () => {
            loadingState.hide();

            const url = router.pathname;

            let token = Storage.get<string>(TOKEN_KEY, null);
            if (token && Token.expiration(token) <= 0) {
                Storage.remove(TOKEN_KEY);
                token = null;
            }

            let { user } = authState;
            let hasError = false;

            if (token && !user) {
                try {
                    Api.defaults.headers.Authorization = `Bearer ${token}`;
                    user = await Api.get<User>('users/me');

                    Storage.set(TOKEN_KEY, token);
                    authState.setUser(user);
                } catch {
                    delete Api.defaults.headers.Authorization;

                    Storage.remove(TOKEN_KEY);
                    authState.setUser(null);

                    hasError = true;
                }
            }

            if (hasError) {
                router.replace('/login');
            } else if (token) {
                if (url == '/login') {
                    router.replace('/');
                } else {
                    const urls = await menuState.getUrls(user);
                    if (
                        urls.includes(url) ||
                        urls.includes(url.replace(/\/\[.+\]$/i, '')) ||
                        DEFAULT_URLS.includes(url)
                    ) {
                        setShowContent(true);
                    } else if (url == '/dashboard' && urls.length > 0) {
                        router.replace(urls[0]);
                    } else if ((url == '/dashboard' && !urls.length) || user.firstLogin) {
                        router.replace(DEFAULT_URLS[0]);
                        await Api.put(`users/${user.id}`, { firstLogin: false });
                    } else {
                        setShow404(true);
                    }
                }
            } else if (url != '/login') {
                router.replace('/login');
            } else {
                setShowContent(true);
            }
        })();
    }, [router.pathname]);

    if (showContent) {
        return children as ReactElement;
    }

    if (show404) {
        return <NotFoundPage />;
    }

    return (
        <Loading>
            <AiOutlineLoading3Quarters />
        </Loading>
    );
}

const Loading = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.5);

    svg {
        color: var(--primary);
        font-size: 40px !important;
        transform: rotate(45deg);
        animation: antRotate 1.2s infinite linear;
    }
`;
