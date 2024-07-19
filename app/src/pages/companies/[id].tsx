import { useRouter } from 'next/router';

import { Button, Card, Form, Input, notification, Skeleton, Tabs } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import InputCamCompany from '@components/Form/InputCamCompany';
import InputCpfOrCnpj from '@components/Form/InputCpfOrCnpj';
import InputPhone from '@components/Form/InputPhone';
import InputUserCompany from '@components/Form/InputUserCompany';
import Layout from '@components/Layout';
import CompanyApi, { CreateOrUpdateCompany } from '@services/Api/CompanyApi';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import { grid } from '@styles/Util';
import Util from '@utils/Util';

export default function CompanyPage() {
    const loadingState = useLoadingState();
    const { translation } = useTranslationState();

    const router = useRouter();
    const [form] = useForm<CreateOrUpdateCompany>();

    const companyId = router.query.id as string;
    const company = CompanyApi.get(companyId);
    const isNew = companyId == 'new';

    async function handleSave(company: CreateOrUpdateCompany) {
        try {
            loadingState.show();

            if (isNew) {
                const companyItem = await CompanyApi.create(company);
                Util.delay(100, () => router.push(`/companies/${companyItem?.id}`));
            } else {
                await CompanyApi.update({
                    id: companyId,
                    ...company
                });
            }

            notification.success({
                message: translation(isNew ? 'Empresa cadastrada' : 'Empresa editada')
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

    function handleBack() {
        router.push('/companies');
    }

    return (
        <Layout>
            <Card
                title={
                    <CardTitle
                        value={translation(isNew ? 'Nova Empresa' : 'Editar Empresa')}
                        toolbar={
                            <Button type="primary" onClick={() => form.submit()}>
                                {translation('Salvar')}
                            </Button>
                        }
                        onBackClick={handleBack}
                    />
                }>
                {company.isLoading && <Skeleton active title={false} paragraph={{ rows: 8 }} />}

                {company.isSuccess && (
                    <FormContainer form={form} layout="vertical" onFinish={handleSave} initialValues={company.data}>
                        <Form.Item name="name" label={translation('Nome Fantasia')} required>
                            <Input />
                        </Form.Item>

                        <InputCpfOrCnpj required name="cnpj" label={translation('CNPJ')} />

                        <InputPhone name="phone" required label={translation('Telefone Comercial')} />

                        <Form.Item name="address" label={translation('Endereço')}>
                            <Input placeholder="EX: PROFESSOR JOSÉ PAULINO, 548 - FAROL CEP: 57051-550 IGREJA DOS CAPUCHINHOS" />
                        </Form.Item>

                        <Tabs>
                            <Tabs.TabPane tab={translation('Usuários')} key="users" forceRender>
                                <Form.Item name="users" rules={[{ required: true }]}>
                                    <InputUserCompany />
                                </Form.Item>
                            </Tabs.TabPane>

                            <Tabs.TabPane tab={translation('Câmeras')} key="cameras" forceRender>
                                <Form.Item name="cameras">
                                    <InputCamCompany companyId={companyId} />
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

    ${grid(
        `
            # # #
            # . .
            # . .
            # . .
        `,
        {
            5: 'span 3',
            6: 'span 3'
        }
    )}

    @media (max-width: 700px) {
        ${grid(6)}
    }
`;
