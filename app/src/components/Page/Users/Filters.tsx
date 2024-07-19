import { Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';

import RoleApi from '@services/Api/RoleApi';
import useTranslationState from '@states/TranslationState';
import { grid } from '@styles/Util';

type Props = {
    onChange?: (filters: Filter) => void;
};

export type Filter = {
    search: string;
    role: string;
};

export const initialValues: Filter = {
    search: '',
    role: 'all'
};

export default function Filters({ onChange }: Props) {
    const { translation } = useTranslationState();

    const [form] = useForm<Filter>();

    const roles = RoleApi.list();

    function handleFormValuesChange(changedValues: Partial<Filter>, values: Filter) {
        onChange(values);
    }

    return (
        <FormContainer
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onValuesChange={handleFormValuesChange}
            onFinish={onChange}>
            <Form.Item name="search" label={translation('Pesquisar')}>
                <Input allowClear />
            </Form.Item>

            <Form.Item name="role" label={translation('Função')}>
                <Select loading={roles.isLoading} optionFilterProp="children" showSearch>
                    <Select.Option value="all">{translation('Todas')}</Select.Option>
                    {roles.isSuccess &&
                        roles.data.map(role => (
                            <Select.Option key={role.id} value={role.id}>
                                {role.name}
                            </Select.Option>
                        ))}
                </Select>
            </Form.Item>

            <input type="submit" style={{ display: 'none' }} />
        </FormContainer>
    );
}

const FormContainer = styled(Form)`
    grid-gap: 16px;
    margin-bottom: 8px;

    .ant-form-item {
        margin: 0;
    }

    ${grid(`# . # . .`, {
        1: 'span 2'
    })}

    @media (max-width: 1200px) {
        ${grid(`# . # . .`, {
            1: 'span 2',
            2: 'span 2'
        })}
    }

    @media (max-width: 700px) {
        ${grid(2)}
    }
`;
