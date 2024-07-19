import { useRouter } from 'next/router';

import { Button, Card, Form, Input, notification, Skeleton, Tabs } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import InputCameraItems from '@components/Form/InputCameraItems';
import Layout from '@components/Layout';
import RoleApi, { Role } from '@services/Api/RoleApi';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import { grid } from '@styles/Util';

export default function RolePage() {
    const loadingState = useLoadingState();
    const { translation } = useTranslationState();

    const router = useRouter();
    const [form] = useForm<Role>();

    const userId = router.query.id as string;
    const isNew = userId == 'new';

    const role = RoleApi.get(userId);

    async function handleSave(user: Role) {
        try {
            loadingState.show();

            if (isNew) {
                await RoleApi.create(user);
            } else {
                await RoleApi.update({
                    id: userId,
                    ...user
                });
            }

            notification.success({
                message: translation(isNew ? 'Câmera cadastrada' : 'Câmera editada')
            });

            router.push('/roles');
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

    function handleBack() {
        router.push('/roles');
    }

    return (
        <Layout>
            <Card
                title={
                    <CardTitle
                        value={translation(isNew ? 'Novo Perfil' : 'Editar Perfil')}
                        toolbar={
                            <Button type="primary" onClick={() => form.submit()}>
                                {translation('Salvar')}
                            </Button>
                        }
                        onBackClick={handleBack}
                    />
                }>
                {role.isLoading && <Skeleton active title={false} paragraph={{ rows: 8 }} />}

                {role.isSuccess && (
                    <FormContainer form={form} layout="vertical" onFinish={handleSave} initialValues={role.data}>
                        <Form.Item name="name" label={translation('Nome')}>
                            <Input />
                        </Form.Item>

                        <Tabs>
                            <Tabs.TabPane tab="Acesso às Câmeras" key="cameras">
                                <Form.Item name="cameras">
                                    <InputCameraItems />
                                </Form.Item>
                            </Tabs.TabPane>
                        </Tabs>

                        <input type="submit" style={{ display: 'none' }} />
                    </FormContainer>
                )}
            </Card>
        </Layout>
    );
}

const FormContainer = styled(Form)`
    grid-gap: 16px;

    .ant-form-item {
        margin: 0;
    }

    ${grid(`
        # # #
        # # .
        # # .
    `)}

    @media (max-width: 700px) {
        ${grid(7)}
    }
`;
