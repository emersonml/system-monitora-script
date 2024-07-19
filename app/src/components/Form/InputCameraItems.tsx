import { MouseEvent, useState } from 'react';

import { Select, Table } from 'antd';
import styled from 'styled-components';

import TableActions from '@components/TableActions';
import CamApi from '@services/Api/CamApi';

export type CamItem = {
    id: string;
    name: string;
    path: string;
};

export type Props = {
    value?: CamItem[];
    onChange?: (value: CamItem[]) => void;
    isManager?: boolean;
};

export default function InputCameraItems({ value = [], onChange, isManager }: Props) {
    const [campaign, setCampaign] = useState<string>();
    const cameras = CamApi.list();
    const listCameras = cameras.data?.list || [];

    function handleRemove(e: MouseEvent, item: CamItem) {
        const newValue = value.filter(itemFilter => itemFilter.id != item.id);
        onChange(newValue);
    }

    function handleSelectChange(campaignId: string) {
        const campaignItem = listCameras?.find(user => user.id == campaignId);

        if (campaignItem) {
            const newValue: CamItem[] = [
                ...value,
                {
                    id: campaignItem.id,
                    name: campaignItem.name,
                    path: campaignItem.path
                }
            ].sort((a, b) => a.name.localeCompare(b.name));
            onChange(newValue);
        }

        setCampaign(null);
    }

    return (
        <Container>
            <Select
                placeholder="Selecione as câmeras que deseja dar acesso a esse perfil."
                optionFilterProp="children"
                showSearch
                value={campaign}
                onChange={handleSelectChange}>
                {listCameras?.map(campaign => (
                    <Select.Option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                    </Select.Option>
                ))}
            </Select>
            <Table dataSource={value} rowKey="id" size="middle" scroll={{ y: 'auto' }}>
                {TableActions({
                    buttons: [
                        {
                            type: 'delete',
                            handle: handleRemove,
                            visible: isManager
                        }
                    ]
                })}

                <Table.Column title="Nome da Câmera" dataIndex="name" width={50} />
                <Table.Column title="Pasta da Câmera" dataIndex="path" width={50} />
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
