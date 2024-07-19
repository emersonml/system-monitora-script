import { useState } from 'react';

import { Button, Card, Form, Input, InputNumber, Modal, notification, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import Layout from '@components/Layout';
import NavigationPrompt from '@components/NavigationPrompt';
import EnvironmentApi, { Environment } from '@services/Api/EnvironmentApi';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import { grid } from '@styles/Util';

export default function EnvironmentsPage() {
    const loadingState = useLoadingState();
    const { translation } = useTranslationState();

    const [hasChange, setHasChange] = useState(false);

    const [form] = useForm<Environment>();

    const environment = EnvironmentApi.get();

    async function handleSave(environment: Environment) {
        try {
            loadingState.show();

            await EnvironmentApi.update(environment);

            setHasChange(false);

            notification.success({
                message: translation('Variáveis atualizadas')
            });
        } catch (error) {
            if (error.message) {
                notification.error({
                    message: translation(error.message)
                });
            }
        } finally {
            loadingState.hide();
        }
    }

    function handleExit() {
        return new Promise<void>(resolve => {
            const modal = Modal.confirm({
                title: translation('Alterações não salvas'),
                content: translation('Deseja salvar as alterações antes de sair?'),
                okText: translation('Sim'),
                cancelText: translation('Não'),
                closable: true,
                onOk: () => {
                    form.submit();
                    resolve();
                },
                onCancel: (action?: { triggerCancel: boolean }) => {
                    if (action?.triggerCancel) return;

                    resolve();
                    modal.destroy();
                }
            });
        });
    }

    function handleFormValuesChange() {
        setHasChange(true);
    }

    return (
        <Layout>
            <NavigationPrompt when={hasChange} callback={handleExit} />
            <Card
                title={
                    <CardTitle
                        value={translation('Variáveis')}
                        toolbar={
                            <Button type="primary" disabled={!hasChange} onClick={() => form.submit()}>
                                {translation('Salvar')}
                            </Button>
                        }
                    />
                }>
                {environment.isLoading && <Skeleton active title={false} paragraph={{ rows: 8 }} />}

                {environment.isSuccess && (
                    <FormContainer
                        form={form}
                        layout="vertical"
                        initialValues={environment.data}
                        onFinish={handleSave}
                        onValuesChange={handleFormValuesChange}>
                        <GeneralContainer>
                            <strong>{translation('Geral')}</strong>

                            <Form.Item name="title" label={translation('Título')}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="customTitle" label={translation('Título')}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="companyName" label={translation('Nome da empresa')}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="loginTitle" label={translation('Título no login')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="jwtExpiration"
                                label={translation('Expiração do token')}
                                tooltip={translation('Em minutos')}>
                                <InputNumber />
                            </Form.Item>

                            <Form.Item
                                name="idleTime"
                                label={translation('Tempo ocioso')}
                                tooltip={translation('Em minutos')}>
                                <InputNumber />
                            </Form.Item>
                        </GeneralContainer>

                        <ImagensContainer>
                            <strong>{translation('Imagens')}</strong>

                            <Form.Item
                                name="favicon"
                                label={translation('Favicon')}
                                tooltip={translation('Tamanho: 32x32')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="loginLogo"
                                label={translation('Logo login')}
                                tooltip={translation('Tamanho: 350x350')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="headerLogo"
                                label={translation('Logo cabeçalho')}
                                tooltip={translation('Tamanho: 270x64')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="backgroundLogin"
                                label={translation('Imagem de fundo do login')}
                                tooltip={translation('Tamanho: 1024x768')}>
                                <Input />
                            </Form.Item>
                        </ImagensContainer>

                        <ImagensContainer>
                            <strong>{translation('Imagens Customizadas')}</strong>

                            <Form.Item
                                name="customFavicon"
                                label={translation('Favicon')}
                                tooltip={translation('Tamanho: 32x32')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="customLoginLogo"
                                label={translation('Logo login')}
                                tooltip={translation('Tamanho: 350x350')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="customHeaderLogo"
                                label={translation('Logo cabeçalho')}
                                tooltip={translation('Tamanho: 270x64')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="customBackgroundLogin"
                                label={translation('Imagem de fundo do login')}
                                tooltip={translation('Tamanho: 1024x768')}>
                                <Input />
                            </Form.Item>
                        </ImagensContainer>

                        <ReportsContainer>
                            <strong>{translation('Relatórios')}</strong>

                            <Form.Item
                                name="reportLogo"
                                label={translation('Logo')}
                                tooltip={translation('Tamanho: 177x80')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="reportHeaderBackground"
                                label={translation('Imagem de fundo do cabeçalho')}
                                tooltip={translation('Tamanho: 595x137')}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="reportHeaderText" label={translation('Texto do cabeçalho')}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="reportFooterBackground"
                                label={translation('Imagem de fundo do rodapé')}
                                tooltip={translation('Tamanho: 595x50')}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="reportFooterText" label={translation('Texto do rodapé')}>
                                <Input />
                            </Form.Item>
                        </ReportsContainer>

                        <input type="submit" style={{ display: 'none' }} />
                    </FormContainer>
                )}
            </Card>
        </Layout>
    );
}

const FormContainer = styled(Form)`
    overflow: auto;
    max-height: calc(100vh - 248px);
    padding-right: 8px;

    > section + section {
        margin-top: 40px;
    }
`;

const Section = styled.section`
    grid-gap: 16px;

    .ant-form-item {
        margin: 0;
    }

    > div + strong {
        margin-top: 24px;
    }
`;

const GeneralContainer = styled(Section)`
    ${grid(
        `
            # . .
            # # #
            # # .
        `,
        {
            1: 'span 3'
        }
    )}

    @media (max-width: 700px) {
        ${grid(6)}
    }
`;

const ImagensContainer = styled(Section)`
    ${grid(
        `
            # . .
            # . .
            # # #
        `,
        {
            1: 'span 3'
        }
    )}

    @media (max-width: 700px) {
        ${grid(5)}
    }
`;

const ReportsContainer = styled(Section)`
    ${grid(
        `
            # . .
            # . .
            # # .
            # # .
        `,
        {
            1: 'span 3'
        }
    )}

    @media (max-width: 700px) {
        ${grid(6)}
    }
`;
