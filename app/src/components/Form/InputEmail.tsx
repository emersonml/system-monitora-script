import React from 'react';

import { Form, FormItemProps, Input } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { MdOutlineMail } from 'react-icons/md';

import useTranslationState from '@states/TranslationState';

type Props = FormItemProps & { size?: SizeType; custom?: boolean };

export default function InputEmail({ name, label, required = false, size, custom = false }: Props) {
    const { translation } = useTranslationState();

    return (
        <Form.Item
            name={name}
            label={label}
            rules={[
                { required },
                {
                    validator: (_, value: string) => {
                        value = value || '';

                        if (value != '' && !/^.+@.+\..{2,}$/.test(value)) {
                            return Promise.reject(new Error(translation('E-mail inválido')));
                        }

                        return Promise.resolve();
                    }
                }
            ]}>
            <Input
                prefix={custom && <MdOutlineMail size={16} />}
                placeholder={custom && translation('E-mail')}
                size={size}
            />
        </Form.Item>
    );
}
