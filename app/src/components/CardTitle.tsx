import { ReactNode } from 'react';

import { Button } from 'antd';
import { MdArrowBack } from 'react-icons/md';
import styled, { css } from 'styled-components';

type Props = {
    value: string | ReactNode;
    onBackClick?: () => void;
    toolbar?: ReactNode;
    toolbarColumn?: boolean;
};

export default function CardTitle({ value, toolbar, toolbarColumn = false, onBackClick }: Props) {
    return (
        <Container>
            <TitleContainer>
                {onBackClick && (
                    <Button type="text" shape="circle" icon={<MdArrowBack size={20} />} onClick={onBackClick} />
                )}

                {value}
            </TitleContainer>

            {toolbar && <ToolbarContainer $toolbarColumn={toolbarColumn}>{toolbar}</ToolbarContainer>}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    @media (max-width: 700px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ToolbarContainer = styled.div<{ $toolbarColumn: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    @media (max-width: 700px) {
        ${props =>
            props.$toolbarColumn
                ? css`
                      flex-direction: column;
                      align-items: flex-end;
                      width: 100%;
                  `
                : css`
                      align-self: flex-end;
                  `}
    }
`;
