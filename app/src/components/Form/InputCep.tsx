import React from 'react';

import { Form, FormItemProps } from 'antd';

import InputMask from '@components/Form/InputMask';
import useTranslationState from '@states/TranslationState';

type Props = FormItemProps;

export default function InputCep({ name, label }: Props) {
    const { translation } = useTranslationState();

    return (
        <Form.Item
            name={name}
            label={label}
            rules={[
                {
                    validator: (_, value: string) => {
                        value = (value || '').replace(/\D/g, '');

                        if (value != '' && value.length < 8) {
                            return Promise.reject(new Error(translation('CEP inválido')));
                        }

                        return Promise.resolve();
                    }
                }
            ]}>
            <InputMask placeholder="xxxxxx-xx" mask="99999-999" />
        </Form.Item>
    );
}
