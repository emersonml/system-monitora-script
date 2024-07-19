import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';

import { Button, Card, Modal, notification, Table } from 'antd';
import { MdAddCircleOutline, MdPrint } from 'react-icons/md';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import Layout from '@components/Layout';
import Filters, { initialValues as initialFilterValues } from '@components/Page/Users/Filters';
import TableActions from '@components/TableActions';
import CompanyApi, { ListCompany } from '@services/Api/CompanyApi';
import useAuthState from '@states/AuthState';
import useTranslationState from '@states/TranslationState';

export default function CompanyPage() {
    const authState = useAuthState();
    const { translation } = useTranslationState();

    const [pagination, setPagination] = useState({ page: 1, size: 10 });
    const [filter, setFilter] = useState(initialFilterValues);

    const router = useRouter();
    const companies = CompanyApi.list({ ...pagination, ...filter });
    const canCreate = authState.can(['user_create']);

    function handleNew() {
        router.push('/companies/new');
    }

    function handleEdit(e: MouseEvent, company: ListCompany) {
        router.push(`/companies/${company.id}`);
    }

    function handleRemove(e: MouseEvent, company: ListCompany) {
        Modal.confirm({
            title: translation('Deseja Excluir a Empresa "{{name}}"?', {
                name: company.name
            }),
            onOk: async () => {
                try {
                    await CompanyApi.delete(company.id);

                    notification.success({
                        message: translation('Empresa Excluída')
                    });
                } catch (error) {
                    notification.error({
                        message: translation(error.message)
                    });
                }
            }
        });
    }

    return (
        <Layout>
            <Card
                title={
                    <CardTitle
                        value={translation('Empresas')}
                        toolbar={
                            <>
                                <Button
                                    type="primary"
                                    icon={<MdPrint size={18} />}
                                    disabled={companies.isLoading || companies.data?.list?.length == 0}>
                                    {translation('Imprimir')}
                                </Button>
                                {canCreate && (
                                    <Button type="primary" icon={<MdAddCircleOutline size={18} />} onClick={handleNew}>
                                        {translation('Nova Empresa')}
                                    </Button>
                                )}
                            </>
                        }
                    />
                }>
                <Filters
                    onChange={filters => {
                        setPagination(pagination => ({ page: 1, size: pagination.size }));
                        setFilter(filters);
                    }}
                />
                <Summary>
                    <strong>{translation('Total')}</strong>
                    <span>{companies?.data?.total || 0}</span>
                </Summary>
                <TableContainer
                    dataSource={companies.data?.list}
                    loading={companies.isLoading}
                    rowKey="id"
                    size="middle"
                    scroll={{ y: 'auto' }}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.size,
                        total: companies.data?.total || 0,
                        showSizeChanger: true,
                        onChange: (page, size) => setPagination({ page, size })
                    }}>
                    {TableActions<ListCompany>({
                        buttons: [
                            {
                                type: 'edit',
                                handle: handleEdit
                            },
                            {
                                type: 'delete',
                                handle: handleRemove
                            }
                        ]
                    })}

                    <Table.Column title={translation('Nome Fantasia')} dataIndex="name" width={300} />
                    <Table.Column title={translation('CNPJ')} dataIndex="cnpj" width={300} />
                    <Table.Column title={translation('Telefone')} dataIndex="phone" width={300} />

                    {TableActions<ListCompany>({
                        buttons: [
                            {
                                type: 'edit',
                                handle: handleEdit
                            },
                            {
                                type: 'delete',
                                handle: handleRemove
                            }
                        ]
                    })}
                </TableContainer>
            </Card>
        </Layout>
    );
}

const Summary = styled.div`
    display: grid;
    grid-template-columns: max-content max-content;
    grid-gap: 4px 16px;
    margin-bottom: 8px;

    span {
        text-align: right;
    }
`;

const TableContainer = styled(Table)`
    .ant-table-body {
        max-height: calc(100vh - 421px) !important;
    }

    @media (max-width: 700px) {
        .ant-table-body {
            max-height: calc(100vh - 532px) !important;
        }
    }

    @media (max-width: 430px) {
        .ant-table-body {
            max-height: 100vh !important;
        }
    }
`;
