import { AppProps } from 'next/app';

import { RecoilRoot } from 'recoil';

import Auth from '@components/Auth';
import CheckInactivity from '@components/CheckInactivity';
import CheckInternet from '@components/CheckInternet';
import DocumentViewer from '@components/DocumentViewer';
import Loading from '@components/Loading';
import { AntdConfigRoot } from '@locales/antd/AntdConfigRoot';
import { QueryClientRoot } from '@services/QueryClient';
import GlobalStyles from '@styles/Global';

import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <RecoilRoot>
            <AntdConfigRoot>
                <QueryClientRoot>
                    <GlobalStyles />
                    <Loading />
                    <DocumentViewer />
                    <CheckInactivity />
                    <CheckInternet />

                    <Auth>
                        <Component {...pageProps} />
                    </Auth>
                </QueryClientRoot>
            </AntdConfigRoot>
        </RecoilRoot>
    );
}
