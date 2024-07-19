import React from 'react';

import { Checkbox, Form, Input } from 'antd';
import styled from 'styled-components';

import { Translation } from '@states/TranslationState';
import { grid } from '@styles/Util';

type Props = {
    translation: Translation;
};

export default function InputContentAreas({ translation }: Props) {
    return (
        <FormContentAreas>
            <strong>{translation('Áreas de interesse')}</strong>

            <div className="form-checkbox">
                <Form.Item name="areaInvestigation" valuePropName="checked">
                    <Checkbox>Investigação Criminal</Checkbox>
                </Form.Item>

                <Form.Item name="areaInteligencia" valuePropName="checked">
                    <Checkbox>Inteligência Policial</Checkbox>
                </Form.Item>

                <Form.Item name="areaJudiciaria" valuePropName="checked">
                    <Checkbox>Polícia Judiciária</Checkbox>
                </Form.Item>
            </div>

            <Form.Item name="areaOuthers" label={translation('Outras (especificar):')}>
                <Input.TextArea placeholder="Exemplo: Administrativa, financeira e etc..." rows={1} />
            </Form.Item>
        </FormContentAreas>
    );
}

const FormContentAreas = styled.div`
    grid-gap: 16px;
    margin-top: 16px;

    div.form-checkbox {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
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
