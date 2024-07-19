import { useRouter } from 'next/router';

import { Button, Card, Form, Input, notification, Select, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import InputCpfOrCnpj from '@components/Form/InputCpfOrCnpj';
import InputEmail from '@components/Form/InputEmail';
import InputPhone from '@components/Form/InputPhone';
import Layout from '@components/Layout';
import RoleApi from '@services/Api/RoleApi';
import UserApi, { CreateOrUpdateUser } from '@services/Api/UserApi';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import { grid } from '@styles/Util';

export default function UserPage() {
    const loadingState = useLoadingState();
    const { translation } = useTranslationState();

    const router = useRouter();
    const [form] = useForm<CreateOrUpdateUser>();

    const userId = router.query.id as string;
    const isNew = userId == 'new';

    const user = UserApi.get(userId);
    const roles = RoleApi.list();

    async function handleSave(user: CreateOrUpdateUser) {
        try {
            loadingState.show();

            if (isNew) {
                await UserApi.create(user);
            } else {
                await UserApi.update({
                    id: userId,
                    ...user
                });
            }

            notification.success({
                message: translation(isNew ? 'Usuário cadastrado' : 'Usuário editado')
            });

            router.push('/users');
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
        router.push('/users');
    }

    return (
        <Layout>
            <Card
                title={
                    <CardTitle
                        value={translation(isNew ? 'Novo usuário' : 'Editar usuário')}
                        toolbar={
                            <Button type="primary" onClick={() => form.submit()}>
                                {translation('Salvar')}
                            </Button>
                        }
                        onBackClick={handleBack}
                    />
                }>
                {user.isLoading && <Skeleton active title={false} paragraph={{ rows: 8 }} />}

                {user.isSuccess && (
                    <FormContainer form={form} layout="vertical" onFinish={handleSave} initialValues={user.data}>
                        <Form.Item name="name" label={translation('Nome')} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <InputCpfOrCnpj name="cpf" label={translation('CPF')} />

                        <InputPhone name="phone" label={translation('Telefone')} />

                        <InputEmail name="email" label={translation('E-mail')} required={false} />

                        <Form.Item name="roles" label={translation('Função')} rules={[{ required: true }]}>
                            <Select mode="multiple" loading={roles.isLoading} optionFilterProp="children">
                                {roles.isSuccess &&
                                    roles.data.map(role => (
                                        <Select.Option key={role.id} value={role.id}>
                                            {role.name}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="username" label={translation('Usuário')}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={translation('Senha')}
                            rules={[
                                {
                                    validator: (_, value: string) => {
                                        value = value || '';
                                        const regex =
                                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,50}$/;

                                        if (value != '' && !regex.test(value)) {
                                            return Promise.reject(
                                                new Error(
                                                    translation(
                                                        'Deve ter 8 dígitos, caractere especial, letra maiúscula e minuscula e número'
                                                    )
                                                )
                                            );
                                        }

                                        return Promise.resolve();
                                    }
                                }
                            ]}>
                            <Input.Password autoComplete="new-password" />
                        </Form.Item>

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
