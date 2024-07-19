import { useRouter } from 'next/router';

import { Button, Result } from 'antd';
import styled from 'styled-components';

import Layout from '@components/Layout';
import useTranslationState from '@states/TranslationState';

export default function NotFoundPage() {
    const router = useRouter();
    const { translation } = useTranslationState();

    function handleHome() {
        router.push('/');
    }

    return (
        <Layout>
            <Container>
                <Result
                    status="404"
                    title="404"
                    subTitle="Página não encontrada."
                    extra={
                        <Button type="primary" onClick={handleHome}>
                            {translation('Ir para o início')}
                        </Button>
                    }
                />
            </Container>
        </Layout>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .ant-result-extra {
        display: flex;
        justify-content: center;
    }
`;
