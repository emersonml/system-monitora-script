import { useState } from 'react';

import { lighten } from 'polished';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import styled, { CSSProperties } from 'styled-components';

export type Props = {
    style?: CSSProperties;
    onChange?: (isFullscreen: boolean) => void;
};

export default function FullscreenButton({ style, onChange }: Props) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    function handleClick() {
        const isDocumentFullScreen = document.fullscreenElement;
        console.log();
        if (isDocumentFullScreen && isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } else if (!isDocumentFullScreen && !isFullscreen && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }

        setIsFullscreen(!isFullscreen);

        if (onChange) {
            onChange(!isFullscreen);
        }
    }

    return (
        <Container onClick={handleClick} style={style}>
            {isFullscreen ? <MdFullscreenExit size={22} /> : <MdFullscreen size={22} />}
        </Container>
    );
}

const Container = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #575757;
    border-radius: 50%;
    transition: background 0.2s, box-shadow 0.2s;

    :hover {
        background: ${lighten(0.6, '#575757')};
        box-shadow: 0 0 0 4px ${lighten(0.6, '#575757')};
    }
`;
