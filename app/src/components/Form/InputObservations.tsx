import React from 'react';

import { Checkbox, Form, Input } from 'antd';
import styled from 'styled-components';

import { Translation } from '@states/TranslationState';
import { grid } from '@styles/Util';

type Props = {
    translation: Translation;
};

export default function InputObservations({ translation }: Props) {
    return (
        <FormContentObservations>
            <strong>{translation('Observações, outros cursos ou habilidades')}</strong>

            <Form.Item name="observations" label={translation('Outros cursos ou habilidades')}>
                <Input.TextArea
                    placeholder="Descreva outras habilidades ou cursos que não estejam listados, exemplo: Programação, informática, autocad e etc..."
                    rows={4}
                />
            </Form.Item>

            <Form.Item name="confirmDeclaration" valuePropName="checked" rules={[{ required: true }]}>
                <Checkbox>
                    <h4>
                        Declaro que as informações fornecidas acima são verdadeiras e completas. Estou ciente de que
                        qualquer informação falsa ou incompleta pode resultar na desqualificação do meu cadastro no
                        processo de empossamento.
                    </h4>
                </Checkbox>
            </Form.Item>
        </FormContentObservations>
    );
}

const FormContentObservations = styled.div`
    grid-gap: 16px;
    margin-top: 16px;

    ${grid(
        `
            # . .
            # . .
            # . .
        `,
        {
            1: 'span 2',
            2: 'span 3',
            3: 'span 3'
        }
    )}

    @media (max-width: 700px) {
        ${grid(7)}
    }
`;
