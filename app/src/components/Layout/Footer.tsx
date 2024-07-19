import { Tooltip } from 'antd';
import styled from 'styled-components';

import useTranslationState from '@states/TranslationState';
import { APP_VERSION, RELEASE_DATE } from '@utils/Constant';
import { COPYRIGHT } from '@utils/Environment';

export default function Footer() {
    const { translation } = useTranslationState();

    return (
        <Container>
            <Tooltip title={RELEASE_DATE}>
                <span>
                    {COPYRIGHT} - {translation('Versão')} {APP_VERSION}
                </span>
            </Tooltip>
        </Container>
    );
}

const Container = styled.footer`
    grid-area: Footer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 8px;
    font-size: 14px;
    color: #808080;
    box-shadow: 0 0 5px 0 rgb(0 0 0 / 25%);

    span {
        cursor: help;
    }
`;
