import React from 'react';

import { Form, FormInstance, FormItemProps } from 'antd';

import InputMask from '@components/Form/InputMask';
import useTranslationState from '@states/TranslationState';

type Props = FormItemProps & {
    required?: boolean;
};

export default function InputPhone<T>({ name, label, required }: Props) {
    const { translation } = useTranslationState();

    function shouldUpdate(prevValues: T, nextValues: T) {
        return prevValues[String(name)] != nextValues[String(name)];
    }

    function getMask(form: FormInstance<T>) {
        const value = (form.getFieldValue(name) || '').replace(/\D/g, '');
        return value.length <= 10 ? '(99) 9999-9999*' : '(99) 9 9999-9999';
    }

    return (
        <Form.Item shouldUpdate={shouldUpdate}>
            {(form: FormInstance<T>) => (
                <Form.Item
                    name={name}
                    label={label}
                    rules={[
                        {
                            required: !!required,
                            validator: (_, value: string) => {
                                value = (value || '').replace(/\D/g, '');

                                if (value != '' && value.length < 10) {
                                    return Promise.reject(new Error(translation('Telefone inválido')));
                                }

                                return Promise.resolve();
                            }
                        }
                    ]}>
                    <InputMask placeholder="(99) 9999-9999" mask={getMask(form)} />
                </Form.Item>
            )}
        </Form.Item>
    );
}
