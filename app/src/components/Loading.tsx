import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import styled from 'styled-components';

import useLoadingState from '@states/LoadingState';

export default function Loading() {
    const { loading } = useLoadingState();

    if (!loading) return null;

    return (
        <Container>
            <AiOutlineLoading3Quarters />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2000;
    background: rgba(255, 255, 255, 0.5);

    svg {
        color: var(--primary);
        font-size: 40px !important;
        transform: rotate(45deg);
        animation: antRotate 1.2s infinite linear;
    }
`;
