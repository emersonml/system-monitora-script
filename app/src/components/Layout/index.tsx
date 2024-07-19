import { ReactNode } from 'react';

import styled from 'styled-components';

import Footer from '@components/Layout/Footer';
import Header from '@components/Layout/Header';
import Menu from '@components/Layout/Menu';

type Props = {
    children: ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <Container>
            <Header />
            <Menu />
            <Content>{children}</Content>
            <Footer />
        </Container>
    );
}

const Container = styled.main`
    display: grid;
    grid-template-areas:
        'Menu Header'
        'Menu Content'
        'Menu Footer';
    grid-template-columns: max-content 1fr;
    grid-template-rows: max-content 1fr max-content;
    height: 100%;

    background: radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(1, 23, 46) 90.2%);

    @media (max-width: 1000px) {
        grid-template-areas:
            'Header'
            'Content'
            'Footer';

        grid-template-columns: 1fr;
    }
`;

const Content = styled.section`
    grid-area: Content;
    overflow: auto;
    background: radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(1, 23, 46) 90.2%);
    padding: 16px;

    @media (max-width: 430px) {
        padding: 8px;
    }
`;
