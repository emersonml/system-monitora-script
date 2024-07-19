import { MouseEvent, useEffect, useRef, useState } from 'react';

import { Button, Card, Input, Modal, notification, Table } from 'antd';
import { MdAdd } from 'react-icons/md';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import Layout from '@components/Layout';
import ModalRole, { ModalRoleRef } from '@components/Modal/ModalRole';
import TableActions from '@components/TableActions';
import CapabilityApi from '@services/Api/CapabilityApi';
import RoleApi, { Role } from '@services/Api/RoleApi';
import useAuthState from '@states/AuthState';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import { Capability } from '@utils/Constant';

export default function PermissionsPage() {
    const loadingState = useLoadingState();
    const authState = useAuthState();
    const { translation } = useTranslationState();

    const modalRoleRef = useRef<ModalRoleRef>();

    const [searchRole, setSearchRole] = useState('');
    const [searchCapability, setSearchCapability] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role>(null);
    const [selectedCapabilities, setSelectedCapabilities] = useState<Capability[]>([]);

    const roles = RoleApi.list({ search: searchRole });
    const capabilities = CapabilityApi.list({ search: searchCapability });

    const canCreate = authState.can(['permission_create']);
    const canEdit = authState.can(['permission_edit']);
    const canDelete = authState.can(['permission_delete']);

    useEffect(() => {
        if (!selectedRole && roles.data?.length > 0) {
            setSelectedRole(roles.data[0]);
        }
    }, [roles.data]);

    useEffect(() => {
        (async () => {
            if (selectedRole) {
                try {
                    loadingState.show();

                    setSelectedCapabilities(await RoleApi.getCapabilities(selectedRole.id));
                } catch (error) {
                    notification.error({
                        message: translation(error.message)
                    });
                } finally {
                    loadingState.hide();
                }
            }
        })();
    }, [selectedRole]);

    function handleAddRole() {
        modalRoleRef.current.show();
    }

    function handleEditRole(e: MouseEvent, role: Role) {
        e.stopPropagation();

        modalRoleRef.current.show(role);
    }

    function handleRemoveRole(e: MouseEvent, role: Role) {
        e.stopPropagation();

        Modal.confirm({
            title: translation('Deseja excluir a função "{{role}}"?', {
                role: role.name
            }),
            onOk: async () => {
                try {
                    await RoleApi.delete(role.id);

                    if (selectedRole.id == role.id) {
                        const currentRoles = roles.data.filter(currentRole => currentRole.id != role.id);
                        if (currentRoles.length > 0) {
                            setSelectedRole(currentRoles[0]);
                        } else {
                            setSelectedRole(null);
                        }
                    }

                    notification.success({
                        message: translation('Função excluída')
                    });
                } catch (error) {
                    notification.error({
                        message: translation(error.message)
                    });
                }
            }
        });
    }

    function handleRoleClick(role: Role) {
        setSelectedRole(role);
    }

    function handleRoleChange(role: Role, originalId: string) {
        if (selectedRole.id == originalId) {
            setSelectedRole(role);
        }
    }

    function handleCapabilityChange(capabilities: Capability[]) {
        setSelectedCapabilities(capabilities);

        try {
            RoleApi.updateCapabilities(selectedRole.id, capabilities);
        } catch (error) {
            notification.error({
                message: translation(error.message)
            });
        }
    }

    return (
        <Layout>
            <ModalRole ref={modalRoleRef} onChange={handleRoleChange} />
            <Container title={translation('Permissões')}>
                <Card
                    title={
                        <CardTitle
                            value={translation('Funções')}
                            toolbar={
                                <>
                                    <Input
                                        placeholder={translation('Pesquisar')}
                                        value={searchRole}
                                        onChange={e => setSearchRole(e.target.value)}
                                        allowClear
                                    />
                                    {canCreate && <ButtonAdd type="dashed" icon={<MdAdd />} onClick={handleAddRole} />}
                                </>
                            }
                        />
                    }>
                    <Table
                        dataSource={roles.data}
                        loading={roles.isLoading}
                        rowKey="id"
                        size="small"
                        scroll={{ y: 'auto' }}
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys: [selectedRole?.id],
                            onChange: (keys, roles) => handleRoleClick(roles[0])
                        }}
                        onRow={role => ({
                            onClick: () => handleRoleClick(role)
                        })}
                        pagination={{
                            showSizeChanger: true
                        }}>
                        <Table.Column title={translation('Nome')} dataIndex="name" width={300} />
                        <Table.Column title={translation('Nível')} dataIndex="level" width={50} />

                        {TableActions<Role>({
                            dataSource: roles.data,
                            buttons: [
                                {
                                    type: 'edit',
                                    visible: canEdit,
                                    handle: handleEditRole
                                },
                                {
                                    type: 'delete',
                                    visible: canDelete,
                                    handle: handleRemoveRole
                                }
                            ]
                        })}
                    </Table>
                </Card>

                <Card
                    title={
                        <CardTitle
                            value={`${translation('Capacidades')} - ${selectedRole?.name || ''}`}
                            toolbar={
                                <Input
                                    placeholder={translation('Pesquisar')}
                                    value={searchCapability}
                                    onChange={e => setSearchCapability(e.target.value)}
                                    allowClear
                                />
                            }
                        />
                    }>
                    <Table
                        dataSource={(capabilities.data || []).map(id => ({ id }))}
                        loading={capabilities.isLoading}
                        rowKey="id"
                        size="small"
                        scroll={{ y: 'auto' }}
                        rowSelection={{
                            type: 'checkbox',
                            preserveSelectedRowKeys: true,
                            selectedRowKeys: selectedCapabilities,
                            getCheckboxProps: () => ({
                                disabled: !canEdit
                            }),
                            onChange: handleCapabilityChange
                        }}
                        pagination={{
                            showSizeChanger: true
                        }}>
                        <Table.Column title={translation('Nome')} dataIndex="id" width={300} />
                    </Table>
                </Card>
            </Container>
        </Layout>
    );
}

const Container = styled(Card)`
    > .ant-card-body {
        display: flex;
    }

    .ant-card {
        flex: 1;

        .ant-table-tbody tr {
            cursor: pointer;
        }
    }

    .ant-card + .ant-card {
        margin-left: 16px;
    }

    @media (max-width: 1200px) {
        > .ant-card-body {
            flex-direction: column;
        }

        .ant-card + .ant-card {
            margin-top: 16px;
            margin-left: 0;
        }
    }
`;

const ButtonAdd = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
`;
