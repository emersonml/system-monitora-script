import React, { useState } from 'react';

import { MdDateRange, MdViewList, MdViewModule, MdViewWeek } from 'react-icons/md';
import styled, { CSSProperties } from 'styled-components';

type Props = {
    style?: CSSProperties;
    defaultActive?: ViewTypeButton;
    buttons: ViewTypeButton[];
    onChange: (type: ViewTypeButton) => void;
};

type IconProps = {
    type: ViewTypeButton;
    size: number;
};

export type ViewTypeButton = 'kanban' | 'grid' | 'list' | 'calendar';

export default function ViewType({ style, defaultActive, buttons, onChange }: Props) {
    const [active, setActive] = useState<ViewTypeButton>(defaultActive || buttons[0]);

    function handleChange(type: ViewTypeButton) {
        onChange(type);
        setActive(type);
    }

    return (
        <Container style={style}>
            {buttons.map(type => (
                <Button key={type} type="button" $active={type == active} onClick={() => handleChange(type)}>
                    <Icon type={type} size={24} />
                </Button>
            ))}
        </Container>
    );
}

function Icon({ type, size }: IconProps) {
    if (type == 'kanban') return <MdViewWeek size={size} />;
    if (type == 'grid') return <MdViewModule size={size} />;
    if (type == 'list') return <MdViewList size={size} />;
    if (type == 'calendar') return <MdDateRange size={size} style={{ padding: 1 }} />;
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    overflow: hidden;
    > button + button {
        border-left: 1px solid #e2e2e2;
    }
`;

const Button = styled.button<{ $active: boolean }>`
    background-color: ${props => (props.$active ? '#f2f2f2' : '#ffffff')};
    font-size: 0;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    :hover {
        background-color: #f2f2f2;
    }
    svg {
        color: #b8c1c1;
    }
`;
