import { MouseEvent } from 'react';

import { Cam } from '@prisma/client';
import { Button, Table } from 'antd';
import { MdAddCircleOutline } from 'react-icons/md';
import styled from 'styled-components';

import TableActions from '@components/TableActions';
import CamApi from '@services/Api/CamApi';
import useTranslationState from '@states/TranslationState';

export type Props = {
    value?: Cam[];
    disabled?: boolean;
    companyId?: string;
    onChange?: (value: Partial<Cam>[]) => void;
};

export default function InputCamCompany({ value = [], disabled, onChange, companyId }: Props) {
    const { translation } = useTranslationState();

    const cameras = CamApi.list();
    function handleRemove(e: MouseEvent, user: Cam) {
        const newValue = value.filter(userFilter => userFilter.id != user.id);
        onChange(newValue);
    }

    function handleAdd() {
        const url = `/cameras/new?companyId=${companyId}`;
        window.open(url, '_blank');
    }

    return (
        <Container>
            <HeaderContainer>
                {!disabled && (
                    <Button
                        disabled={companyId === 'new'}
                        type="primary"
                        icon={<MdAddCircleOutline size={18} />}
                        onClick={() => handleAdd()}>
                        {translation('Adicionar Nova Câmera')}
                    </Button>
                )}
            </HeaderContainer>
            <Table dataSource={value} loading={cameras.isLoading} rowKey="id" size="middle" scroll={{ y: 'auto' }}>
                <Table.Column title={translation('Nome')} dataIndex="name" width={200} />
                <Table.Column title={translation('Pasta da Câmera')} dataIndex="path" width={300} />

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

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 8px;
`;
