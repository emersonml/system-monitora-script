import { forwardRef, Ref, useImperativeHandle, useState } from 'react';

import { Form, Input, InputNumber, Modal, notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';

import RoleApi, { Role } from '@services/Api/RoleApi';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import { grid } from '@styles/Util';
import Util from '@utils/Util';

type Props = {
    onChange?: (role: Role, originalId: string) => void;
};

export type ModalRoleRef = {
    show: (role?: Role) => void;
};

function ModalRole({ onChange }: Props, ref: Ref<ModalRoleRef>) {
    useImperativeHandle(ref, () => ({ show }));

    const loadingState = useLoadingState();
    const { translation } = useTranslationState();

    const [visible, setVisible] = useState(false);
    const [isNew, setIsNew] = useState(true);

    const [form] = useForm<Role>();

    function show(role?: Role) {
        form.setFieldsValue(role);

        setIsNew(role?.id == null);
        setVisible(true);
    }

    async function handleOk(role: Role) {
        try {
            loadingState.show();

            if (isNew) {
                await RoleApi.create(role);
            } else {
                const id = form.getFieldValue('id');
                const updatedRole = await RoleApi.update(role, id);

                if (onChange) {
                    onChange(updatedRole, id);
                }
            }

            notification.success({
                message: translation(isNew ? 'Função criada' : 'Função editada')
            });

            handleCancel();
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

    function handleCancel() {
        setVisible(false);

        Util.delay(100, () => {
            setIsNew(true);
            form.resetFields();
        });
    }

    return (
        <Modal
            title={translation(isNew ? 'Adicionar função' : 'Editar função')}
            visible={visible}
            closable={false}
            onOk={() => form.submit()}
            onCancel={handleCancel}>
            <FormContainer form={form} layout="vertical" onFinish={handleOk}>
                <Form.Item name="name" label={translation('Nome')} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="id" label={translation('Slug')}>
                    <Input />
                </Form.Item>

                <Form.Item name="level" label={translation('Nível')}>
                    <InputNumber min={1} max={1000} />
                </Form.Item>

                <input type="submit" style={{ display: 'none' }} />
            </FormContainer>
        </Modal>
    );
}

const FormContainer = styled(Form)`
    grid-gap: 16px;

    .ant-form-item {
        margin: 0;
    }

    .ant-input-number {
        width: 100%;
    }

    ${grid(
        `
            # . .
            # . #
        `,
        {
            1: 'span 3',
            2: 'span 2'
        }
    )}

    @media (max-width: 700px) {
        .ant-input-number {
            width: 90px;
        }

        ${grid(3)}
    }
`;

export default forwardRef(ModalRole);
