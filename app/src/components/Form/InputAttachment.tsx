import { MouseEvent, useEffect, useState } from 'react';

import { Button, Form, Input, Modal, notification, Table, Tooltip } from 'antd';
import { MdUpload } from 'react-icons/md';
import styled from 'styled-components';

import { AttachmentModel } from '@api/controllers/AttachmentController';
import DocumentIcon from '@components/DocumentIcon';
import TableActions from '@components/TableActions';
import useDocumentView from '@hooks/DocumentView';
import AttachmentApi, { Attachment } from '@services/Api/AttachmentApi';
import EnvironmentApi from '@services/Api/EnvironmentApi';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import FileBrowser from '@utils/FileBrowser';
import Util from '@utils/Util';

export type Props = {
    value?: Attachment[];
    modelId: string;
    model: AttachmentModel;
    onChange?: (value: Attachment[]) => void;
    customFileType?: boolean;
};

export default function InputAttachment({ value = [], modelId, model, onChange }: Props) {
    const loadingState = useLoadingState();
    const { translation } = useTranslationState();
    const typeFileName = 'Nenhum';

    const [search, setSearch] = useState<string>('');
    const [filteredList, setFilteredList] = useState<Attachment[]>([]);

    const documentView = useDocumentView();

    useEffect(() => {
        const searchNormalized = Util.normalize(search);

        setFilteredList(value.filter(attachment => attachment.filename.includes(searchNormalized)));
    }, [...value, search]);

    async function handleAdd() {
        try {
            let files = await FileBrowser.open({
                accept: '.pdf',
                multiple: true
            });

            if (files) {
                const environment = await EnvironmentApi.getWithPromise();
                const bigFiles = [];
                files = files.filter(file => {
                    if (file.size >= environment.documentMaxUploadSize * 1e6) {
                        bigFiles.push(file);
                        return false;
                    }
                    return true;
                });

                if (files.length > 0) {
                    loadingState.show();

                    let newAttachments = await Promise.all(
                        files.map(file => AttachmentApi.create({ modelId, model, typeName: typeFileName, file }))
                    );

                    newAttachments = Util.removeDuplicate<Attachment>(
                        [...value, ...newAttachments],
                        attachment => attachment.id
                    );
                    console.log('newAttachments', newAttachments);

                    onChange(newAttachments.sort((a, b) => a.filename.localeCompare(b.filename)));

                    notification.success({
                        message: translation('Documento(s) adicionado(s)')
                    });
                }

                if (bigFiles.length > 0) {
                    const filenames = bigFiles.map(file => file.name).join(', ');
                    notification.warn({
                        message: translation('Documento(s) "{{filenames}}" acima do tamanho comportado', {
                            filenames
                        })
                    });
                }
            }
        } catch (error) {
            notification.error({
                message: translation(error.message)
            });
        } finally {
            loadingState.hide();
        }
    }

    function handleRemove(e: MouseEvent, attachment: Attachment) {
        Modal.confirm({
            title: translation('Deseja excluir o documento "{{name}}"?', {
                name: attachment.filename
            }),
            onOk: async () => {
                try {
                    await AttachmentApi.delete(attachment.id, modelId, model);

                    onChange(value.filter(attachmentFilter => attachmentFilter.id != attachment.id));

                    notification.success({
                        message: translation('Documento excluído')
                    });
                } catch (error) {
                    notification.error({
                        message: translation(error.message)
                    });
                }
            }
        });
    }

    function handleDocumentClick(attachment: Attachment) {
        documentView(attachment.filename, attachment.url);
    }

    return (
        <>
            <HeaderContainer>
                <Input
                    placeholder={translation('Pesquise dentro dos documentos')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    allowClear
                />

                <div>
                    <Form.Item
                        label={translation('Faça upload do documento')}
                        tooltip={translation('Tamanho: 150x150')}>
                        <Tooltip title="Só é permitido arquivos em pdf">
                            <Button type="primary" icon={<MdUpload size={18} />} onClick={handleAdd}>
                                {translation('Subir Documento')}
                            </Button>
                        </Tooltip>
                    </Form.Item>
                </div>
            </HeaderContainer>

            <Table dataSource={filteredList} rowKey="id" size="middle" scroll={{ y: 'auto' }}>
                <Table.Column
                    title={translation('Tipo')}
                    dataIndex="url"
                    align="center"
                    width={50}
                    render={(url, attachment: Attachment) => (
                        <DocumentIconList
                            name={Util.getExtName(url, true)}
                            onClick={() => handleDocumentClick(attachment)}
                        />
                    )}
                />
                <Table.Column title={translation('Nome')} dataIndex="filename" width={300} />
                {typeFileName && (
                    <Table.Column title={translation('Categoria de Arquivo')} dataIndex="typeName" width={150} />
                )}

                {TableActions({
                    translation,
                    buttons: [
                        {
                            type: 'delete',
                            handle: handleRemove
                        }
                    ]
                })}
            </Table>
        </>
    );
}

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;

    > span {
        max-width: 40%;
    }

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    @media (max-width: 550px) {
        flex-direction: column;
        align-items: flex-start;

        > span {
            max-width: 100% !important;
        }

        > button {
            align-self: flex-end;
        }
    }
`;

const DocumentIconList = styled(DocumentIcon)`
    cursor: pointer;
`;
