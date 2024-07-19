import React from 'react';

import { Checkbox, Form, Input } from 'antd';
import styled from 'styled-components';

import { Translation } from '@states/TranslationState';
import { grid } from '@styles/Util';

type Props = {
    translation: Translation;
};

export default function InputContentExternalCurricular({ translation }: Props) {
    return (
        <FormContentExternalCurricular>
            <strong>{translation('Habilidades Extra Curriculares')}</strong>

            <div>
                <Form.Item name="skillComunication" valuePropName="checked">
                    <Checkbox>Comunicação</Checkbox>
                </Form.Item>

                <Form.Item name="skillEquipe" valuePropName="checked">
                    <Checkbox>Trabalho em Equipe</Checkbox>
                </Form.Item>

                <Form.Item name="skillLider" valuePropName="checked">
                    <Checkbox>Liderança</Checkbox>
                </Form.Item>

                <Form.Item name="skillResolutions" valuePropName="checked">
                    <Checkbox>Resolução de Problemas</Checkbox>
                </Form.Item>
            </div>

            <Form.Item name="skillOuthers" label={translation('Especificar outros')}>
                <Input.TextArea
                    rows={1}
                    placeholder="Exemplo: Fácil aprendizagem, Fluência em outras línguas, Aprendizado contínuo e etc..."
                />
            </Form.Item>
        </FormContentExternalCurricular>
    );
}

const FormContentExternalCurricular = styled.div`
    grid-gap: 16px;
    margin: 16px 0;

    div {
        display: flex;
    }

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
