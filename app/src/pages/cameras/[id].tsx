import { useRouter } from 'next/router';

import { Button, Card, Form, Input, notification, Select, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import Layout from '@components/Layout';
import CamApi, { CreateOrUpdateCam } from '@services/Api/CamApi';
import CompanyApi from '@services/Api/CompanyApi';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import { grid } from '@styles/Util';

export default function CameraPage() {
    const loadingState = useLoadingState();
    const { translation } = useTranslationState();
    const router = useRouter();

    const [form] = useForm<CreateOrUpdateCam>();

    const companyId = router.query.companyId as string;
    const userId = router.query.id as string;
    const isNew = userId == 'new';

    const cam = CamApi.get(userId);
    const companies = CompanyApi.list();

    async function handleSave(user: CreateOrUpdateCam) {
        try {
            loadingState.show();

            if (isNew) {
                await CamApi.create(user);
            } else {
                await CamApi.update({
                    id: userId,
                    ...user
                });
            }

            notification.success({
                message: translation(isNew ? 'Câmera cadastrada' : 'Câmera editada')
            });

            router.push('/cameras');
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
        router.push('/cameras');
    }

    const initialValues: CreateOrUpdateCam = companyId
        ? {
              ...cam?.data,
              companyId
          }
        : cam?.data;

    return (
        <Layout>
            <Card
                title={
                    <CardTitle
                        value={translation(isNew ? 'Nova Câmera' : 'Editar Câmera')}
                        toolbar={
                            <Button type="primary" onClick={() => form.submit()}>
                                {translation('Salvar')}
                            </Button>
                        }
                        onBackClick={handleBack}
                    />
                }>
                {cam.isLoading && <Skeleton active title={false} paragraph={{ rows: 8 }} />}

                {cam.isSuccess && (
                    <FormContainer form={form} layout="vertical" onFinish={handleSave} initialValues={initialValues}>
                        <Form.Item name="name" label={translation('Nome do Aparelho')} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="path"
                            label={translation('A pasta Configurado FTP')}
                            rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="position"
                            label={translation('Posição da Câmera')}
                            rules={[{ required: true }]}>
                            <Select placeholder="Selecione a Posição">
                                <Select.Option value="frontal">Frontal</Select.Option>
                                <Select.Option value="traseira">Traseira</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="typeRecognition"
                            label={translation('Tipo de Reconhecimento')}
                            rules={[{ required: true }]}>
                            <Select placeholder="Selecione o Tipo">
                                <Select.Option value="place">Placas Veículos</Select.Option>
                                <Select.Option value="face">Facial</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="adminInformation"
                            label={translation('Informação de Acesso a Câmera')}
                            rules={[{ required: true }]}>
                            <Input placeholder="Usuário, senha e URL de Acesso" />
                        </Form.Item>

                        <Form.Item
                            name="companyId"
                            label={translation('Empresa/Condomínio')}
                            rules={[{ required: true }]}>
                            <Select loading={companies?.isLoading} optionFilterProp="children">
                                {companies?.isSuccess &&
                                    companies?.data?.list?.map(company => (
                                        <Select.Option key={company.id} value={company.id}>
                                            {company.name}
                                        </Select.Option>
                                    ))}
                            </Select>
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
        # # #
    `)}

    @media (max-width: 700px) {
        ${grid(6)}
    }
`;
