import React from 'react';

import { Button, Form, Tooltip } from 'antd';
import { BsArrowDownCircleFill } from 'react-icons/bs';
import styled from 'styled-components';

import InputAttachment from '@components/Form/InputAttachment';
import { Translation } from '@states/TranslationState';

type Props = {
    translation: Translation;
    userId: string;
};

export function handleDownload() {
    window.open(
        'https://digital.pc.al.gov.br/api/attachments/view/12a3300a-b6a2-4b00-b1d7-6d636266d3eb.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NmIzZTY1NS0wNGY4LTQwZTgtOTM3Zi0zMDdiNDM0YjkwOWYiLCJwYXRoIjoiMTJhMzMwMGEtYjZhMi00YjAwLWIxZDctNmQ2MzYyNjZkM2ViLnBkZiIsImlhdCI6MTY5NDAxMzQzOSwiZXhwIjoxNjk0MDk5ODM5fQ.locScM7eLpdC_vp43G7rX2zuV3NOL2a7LOOIkvv0QWs',
        '_blank'
    );
}

export default function InputContentFiles({ translation, userId }: Props) {
    return (
        <FormFiles>
            <strong>{translation('Baixe e preencha o documento, depois faça o upload no sistema.')}</strong>

            <Tooltip title="Clique no botão para baixar o pdf">
                <Button type="primary" icon={<BsArrowDownCircleFill size={18} />} onClick={handleDownload}>
                    {translation('Baixar formulário')}
                </Button>
            </Tooltip>

            {userId && (
                <FormContentFiles>
                    <Form.Item name="attachments">
                        <InputAttachment customFileType modelId={userId} model="user" />
                    </Form.Item>
                </FormContentFiles>
            )}
        </FormFiles>
    );
}

const FormFiles = styled.div`
    grid-gap: 16px;
    margin-top: 16px;
`;

const FormContentFiles = styled.div`
    grid-gap: 16px;
    margin-top: 16px;
`;
