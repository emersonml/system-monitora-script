import React from 'react';

import { Form, FormItemProps } from 'antd';

import InputMask from '@components/Form/InputMask';
import useTranslationState from '@states/TranslationState';

type Props = FormItemProps & {
    required?: boolean;
    canDisabled?: boolean;
};

export default function InputCpfOrCnpj<T>({ name, label, required, canDisabled }: Props) {
    const { translation } = useTranslationState();

    function shouldUpdate(prevValues: T, nextValues: T) {
        return prevValues[String(name)] != nextValues[String(name)];
    }

    return (
        <Form.Item shouldUpdate={shouldUpdate}>
            <Form.Item
                name={name}
                label={label}
                rules={[
                    {
                        required: !!required,
                        validator: (_, value: string) => {
                            value = (value || '').replace(/\D/g, '');

                            if (value != '') {
                                if (value.length <= 11) {
                                    if (!/\d{11}/.test(value)) {
                                        return Promise.reject(new Error(translation('CPF inválido')));
                                    }
                                } else if (!/\d{14}/.test(value)) {
                                    return Promise.reject(new Error(translation('CNPJ inválido')));
                                }
                            }

                            return Promise.resolve();
                        }
                    }
                ]}>
                <InputMask disabled={canDisabled} placeholder="XXX.XXX.XXX-XX" mask="99.999.999/9999-99" />
            </Form.Item>
        </Form.Item>
    );
}
