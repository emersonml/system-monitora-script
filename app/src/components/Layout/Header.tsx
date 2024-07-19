import Head from 'next/head';

import { Button } from 'antd';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import styled from 'styled-components';

import useMediaQuery from '@hooks/MediaQuery';
import EnvironmentApi from '@services/Api/EnvironmentApi';
import useMenuState from '@states/MenuState';

export default function Header() {
    const menuState = useMenuState();

    const environment = EnvironmentApi.get();
    const showDrawerMenu = useMediaQuery('max-width: 1000px');

    function handleToggleMenu() {
        if (showDrawerMenu) {
            menuState.toggle();
        } else {
            menuState.toggleExpanded();
        }
    }

    return (
        <>
            <Head>
                <title>{environment.data?.title}</title>
                <link rel="icon" href={environment.data?.favicon} />

                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
            </Head>

            <Container>
                <ButtonMenu
                    type="text"
                    icon={menuState.expanded ? <AiOutlineMenuUnfold size={24} /> : <AiOutlineMenuFold size={24} />}
                    onClick={handleToggleMenu}
                />
                <Logo src="/images/login/logo_pequena.png" alt="" />
            </Container>
        </>
    );
}

const Container = styled.header`
    grid-area: Header;
    display: flex;
    align-items: center;
    height: 64px;
    z-index: 100;
    background: var(--primary);
    box-shadow: 0 0 5px 0 rgb(0 0 0 / 25%);
`;

const ButtonMenu = styled(Button)`
    margin: 0 4px;

    svg {
        color: #ffffff;
    }
`;

const Logo = styled.img`
    width: 270px;
    height: 64px;
`;
