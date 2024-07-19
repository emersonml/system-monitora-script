import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';

import { Button, Card, Modal, notification, Table } from 'antd';
import { MdAddCircleOutline, MdPrint } from 'react-icons/md';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import Layout from '@components/Layout';
import Filters, { initialValues as initialFilterValues } from '@components/Page/Users/Filters';
import TableActions from '@components/TableActions';
import useReport from '@hooks/Report';
import UserApi, { ListUser } from '@services/Api/UserApi';
import useAuthState from '@states/AuthState';
import useTranslationState from '@states/TranslationState';

export default function UsersPage() {
    const authState = useAuthState();
    const { translation } = useTranslationState();

    const [pagination, setPagination] = useState({ page: 1, size: 10 });
    const [filter, setFilter] = useState(initialFilterValues);

    const router = useRouter();
    const report = useReport();

    const users = UserApi.list({ ...pagination, ...filter });

    const canCreate = authState.can(['user_create']);
    const canEdit = authState.can(['user_edit']);
    const canDelete = authState.can(['user_delete']);

    function handlePrint() {
        report(async () => {
            const users = await UserApi.listWithPromise(filter);

            return {
                title: translation('Usuários'),
                content: [
                    {
                        text: translation('Usuários'),
                        style: {
                            bold: true
                        },
                        margin: [0, 0, 0, 10]
                    },
                    {
                        table: {
                            widths: ['auto', 'auto', '*'],
                            body: [
                                [translation('Nome'), translation('Usuário'), translation('Função')],
                                ...users.list.map(user => [user.name, user.username, user.roles.join(' | ')])
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    }
                ]
            };
        });
    }

    function handleNew() {
        router.push('/users/new');
    }

    function handleEdit(e: MouseEvent, user: ListUser) {
        router.push(`/users/${user.id}`);
    }

    function handleRemove(e: MouseEvent, user: ListUser) {
        Modal.confirm({
            title: translation('Deseja excluir o usuário "{{name}}"?', {
                name: user.name
            }),
            onOk: async () => {
                try {
                    await UserApi.delete(user.id);

                    notification.success({
                        message: translation('Usuário excluído')
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
                        value={translation('Usuários')}
                        toolbar={
                            <>
                                <Button
                                    type="primary"
                                    icon={<MdPrint size={18} />}
                                    disabled={users.isLoading || users.data?.list?.length == 0}
                                    onClick={handlePrint}>
                                    {translation('Imprimir')}
                                </Button>
                                {canCreate && (
                                    <Button type="primary" icon={<MdAddCircleOutline size={18} />} onClick={handleNew}>
                                        {translation('Novo usuário')}
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
                    <span>{users?.data?.total || 0}</span>
                </Summary>
                <TableContainer
                    dataSource={users.data?.list}
                    loading={users.isLoading}
                    rowKey="id"
                    size="middle"
                    scroll={{ y: 'auto' }}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.size,
                        total: users.data?.total || 0,
                        showSizeChanger: true,
                        onChange: (page, size) => setPagination({ page, size })
                    }}>
                    {TableActions<ListUser>({
                        buttons: [
                            {
                                type: 'edit',
                                visible: user => canEdit && !user.onlyView,
                                handle: handleEdit
                            },
                            {
                                type: 'delete',
                                visible: user => canDelete && !user.onlyView,
                                handle: handleRemove
                            }
                        ]
                    })}

                    <Table.Column title={translation('Nome')} dataIndex="name" width={300} />
                    <Table.Column title={translation('Usuário')} dataIndex="username" width={200} />
                    <Table.Column
                        title={translation('Função')}
                        dataIndex="roles"
                        width={300}
                        render={(roles: string[]) => roles.join(' | ')}
                    />

                    {TableActions<ListUser>({
                        buttons: [
                            {
                                type: 'edit',
                                visible: user => canEdit && !user.onlyView,
                                handle: handleEdit
                            },
                            {
                                type: 'delete',
                                visible: user => canDelete && !user.onlyView,
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
