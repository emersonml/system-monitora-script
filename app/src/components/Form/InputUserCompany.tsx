import { MouseEvent, useState } from 'react';

import { User } from '@prisma/client';
import { Select, Table } from 'antd';
import styled from 'styled-components';

import TableActions from '@components/TableActions';
import UserApi from '@services/Api/UserApi';
import useTranslationState from '@states/TranslationState';

export type Props = {
    value?: User[];
    disabled?: boolean;
    onChange?: (value: Partial<User>[]) => void;
};

export default function InputUserCompany({ value = [], disabled, onChange }: Props) {
    const { translation } = useTranslationState();

    const [user, setUser] = useState<string>(null);

    const users = UserApi.list();

    function handleSelectChange(userId: string) {
        const user = users.isSuccess ? users.data.list.find(user => user.id == userId) : null;

        if (user) {
            const newValue: Partial<User>[] = [
                ...value,
                {
                    id: user.id,
                    name: user.name,
                    roles: user.roles
                }
            ].sort((a, b) => a.name.localeCompare(b.name));

            onChange(newValue);
        }

        setUser(null);
    }

    function handleRemove(e: MouseEvent, user: User) {
        const newValue = value.filter(userFilter => userFilter.id != user.id);

        onChange(newValue);
    }

    const usersData = users?.data?.list || [];
    const usersNotSelected = usersData?.filter(user => !value || !value.map(user => user.id).includes(user.id));

    return (
        <Container>
            {!disabled && (
                <Select
                    loading={users.isLoading}
                    optionFilterProp="children"
                    showSearch
                    value={user}
                    onChange={handleSelectChange}>
                    {users.isSuccess &&
                        usersNotSelected?.map(user => (
                            <Select.Option key={user.id} value={user.id}>
                                {user?.name}
                            </Select.Option>
                        ))}
                </Select>
            )}

            <Table dataSource={value} loading={users.isLoading} rowKey="id" size="middle" scroll={{ y: 'auto' }}>
                <Table.Column title={translation('Nome')} dataIndex="name" width={200} />
                <Table.Column
                    title={translation('Função')}
                    dataIndex="roles"
                    width={300}
                    render={(roles: string[]) => roles?.join(' | ')}
                />

                {TableActions({
                    buttons: [
                        {
                            type: 'delete',
                            visible: !disabled,
                            handle: handleRemove
                        }
                    ]
                })}
            </Table>
        </Container>
    );
}

const Container = styled.div`
    .ant-table-wrapper {
        margin-top: 8px;

        .ant-select {
            width: 130px;
        }
    }
`;
