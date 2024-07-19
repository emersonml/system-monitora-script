import { MouseEvent, ReactNode } from 'react';

import { Button, Table, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { MdDelete, MdEdit, MdPrint, MdVisibility } from 'react-icons/md';
import styled from 'styled-components';

import useTranslationState, { Translation } from '@states/TranslationState';

type Props<T> = ColumnProps<T> & {
    translation?: Translation;
    dataSource?: T[];
    buttons: ButtonProps<T>[];
};

type ButtonProps<T> = {
    type?: 'view' | 'edit' | 'delete' | 'print';
    title?: string;
    Icon?: ReactNode | ((data: T) => ReactNode);
    visible?: boolean | ((data: T) => boolean);
    handle: (e: MouseEvent, data: T) => void;
};

export default function TableActions<T>({ translation, dataSource, buttons, ...columnProps }: Props<T>) {
    if (!translation) {
        translation = useTranslationState().translation;
    }

    buttons = buttons
        .filter(({ visible }) => {
            if (visible == null) return true;

            if (typeof visible == 'function' && dataSource) {
                return dataSource.some(data => visible(data));
            }

            return visible;
        })
        .map(button => {
            if (button.visible == null) {
                button.visible = true;
            }

            if (button.type == 'view') {
                button.title = translation('Visualizar');
                button.Icon = <MdVisibility />;
            } else if (button.type == 'print') {
                button.title = translation('Imprimir');
                button.Icon = <MdPrint />;
            } else if (button.type == 'edit') {
                button.title = translation('Editar');
                button.Icon = <MdEdit />;
            } else if (button.type == 'delete') {
                button.title = translation('Excluir');
                button.Icon = <MdDelete />;
            }

            return button;
        });

    if (buttons.length == 0) return null;

    return (
        <Table.Column
            {...columnProps}
            title={translation('Ações')}
            align="center"
            width={100}
            render={(_, data) => (
                <Actions>
                    {buttons
                        .filter(button => (typeof button.visible == 'function' ? button.visible(data) : button.visible))
                        .map(button => (
                            <Tooltip key={button.title} title={button.title} placement="bottom">
                                <Button
                                    type="link"
                                    icon={typeof button.Icon == 'function' ? button.Icon(data) : button.Icon}
                                    onClick={e => button.handle(e, data)}
                                />
                            </Tooltip>
                        ))}
                </Actions>
            )}
        />
    );
}

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
