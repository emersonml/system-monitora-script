import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';

import { Button, Card, Modal, notification, Table } from 'antd';
import { MdAddCircleOutline, MdPrint } from 'react-icons/md';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import Layout from '@components/Layout';
import Filters, { initialValues as initialFilterValues } from '@components/Page/Users/Filters';
import TableActions from '@components/TableActions';
import RoleApi, { Role } from '@services/Api/RoleApi';
import useAuthState from '@states/AuthState';
import useTranslationState from '@states/TranslationState';

export default function RolesPage() {
    const authState = useAuthState();
    const { translation } = useTranslationState();

    const [pagination, setPagination] = useState({ page: 1, size: 10 });
    const [filter, setFilter] = useState(initialFilterValues);

    const router = useRouter();
    const roles = RoleApi.list(filter);

    const canCreate = authState.can(['user_create']);

    function handleNew() {
        router.push('/roles/new');
    }

    function handleEdit(e: MouseEvent, user: Role) {
        router.push(`/roles/${user.id}`);
    }

    function handleRemove(e: MouseEvent, role: Role) {
        e.stopPropagation();

        Modal.confirm({
            title: translation('Deseja excluir o perfil "{{role}}"?', {
                role: role.name
            }),
            onOk: async () => {
                try {
                    await RoleApi.delete(role.id);

                    notification.success({
                        message: translation('Perfil excluído')
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
                        value={translation('Perfis/Funções')}
                        toolbar={
                            <>
                                <Button
                                    type="primary"
                                    icon={<MdPrint size={18} />}
                                    disabled={roles.isLoading || roles.data?.length == 0}>
                                    {translation('Imprimir')}
                                </Button>
                                {canCreate && (
                                    <Button type="primary" icon={<MdAddCircleOutline size={18} />} onClick={handleNew}>
                                        {translation('Novo perfil')}
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
                    <span>{roles?.data?.length || 0}</span>
                </Summary>
                <TableContainer
                    dataSource={roles.data}
                    loading={roles.isLoading}
                    rowKey="id"
                    size="middle"
                    scroll={{ y: 'auto' }}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.size,
                        total: roles?.data?.length || 0,
                        showSizeChanger: true,
                        onChange: (page, size) => setPagination({ page, size })
                    }}>
                    {TableActions<Role>({
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

                    <Table.Column title={translation('Nome')} dataIndex="name" width={300} />
                    <Table.Column title={translation('Nível')} dataIndex="level" width={50} />

                    {TableActions<Role>({
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
