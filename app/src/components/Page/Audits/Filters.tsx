import { Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';

import DatePicker from '@components/Form/DatePicker';
import UserApi from '@services/Api/UserApi';
import useTranslationState from '@states/TranslationState';
import { grid } from '@styles/Util';

type Props = {
    onChange?: (filters: Filter) => void;
};

export type Filter = {
    search: string;
    author: string;
    startDate: Date;
    endDate: Date;
};

export const initialValues: Filter = {
    search: '',
    author: 'all',
    startDate: new Date(),
    endDate: new Date()
};

export default function Filters({ onChange }: Props) {
    const { translation } = useTranslationState();

    const [form] = useForm<Filter>();

    const users = UserApi.list();

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

            <Form.Item name="author" label={translation('Usuário')}>
                <Select loading={users.isLoading} optionFilterProp="children" showSearch>
                    <Select.Option value="all">{translation('Todos')}</Select.Option>
                    {users.isSuccess &&
                        users.data.list.map(user => (
                            <Select.Option key={user.id} value={user.id}>
                                {user.name}
                            </Select.Option>
                        ))}
                </Select>
            </Form.Item>

            <Form.Item name="startDate" label={translation('Data de início')}>
                <DatePicker />
            </Form.Item>

            <Form.Item name="endDate" label={translation('Data de fim')}>
                <DatePicker />
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

    .ant-picker {
        width: 100%;
    }

    ${grid(`# . # # #`, {
        1: 'span 2'
    })}

    @media (max-width: 1300px) {
        ${grid(`
            # #
            # #
        `)}
    }

    @media (max-width: 700px) {
        ${grid(4)}
    }
`;
