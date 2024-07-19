import { createGlobalStyle } from 'styled-components';

import './Antd.less';

const styled = { createGlobalStyle };

export default styled.createGlobalStyle`
    html,
    body {
        width: 100vw;
        height: 100vh;
    }

    * {
        font-family: 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar {
        height: 8px;
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #c1c1c1;
        border-radius: 4px;
    }

    #__next {
        width: 100%;
        height: 100%;
        font-size: 16px;
    }

    ul,
    ol {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    *:disabled {
        color: var(--text-color-base);
    }
`;
