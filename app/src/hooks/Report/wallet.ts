import { notification } from 'antd';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

import EnvironmentApi from '@services/Api/EnvironmentApi';
import useDocumentViewerState from '@states/DocumentViewerState';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import PDF from '@utils/PDF';
import Util from '@utils/Util';

export type Return = {
    title: string;
    content: Content | Content[];
    extra?: Extra;
};

type Extra = {
    footer?: Content | Content[];
};
type Callback = () => Return | Promise<Return>;

export default function useReportWallet() {
    const loadingState = useLoadingState();
    const documentViewerState = useDocumentViewerState();
    const { translation } = useTranslationState();

    async function template(content: Content | Content[], extra: Extra): Promise<TDocumentDefinitions> {

        const header: Content[] = [];
        const footer: Content[] = [];

        return {
            pageMargins: [100, 0, 100, 0],
            background: header,
            content,
            footer
        };
    }

    return async (callback: Callback) => {
        try {
            loadingState.show();

            const { title, content, extra } = await callback();
            const config = await template(content, extra);

            if (window.innerWidth < 430) {
                PDF.download(config);
            } else {
                documentViewerState.show({
                    type: 'pdf',
                    title,
                    url: await PDF.createUrl(config)
                });
            }
        } catch (error) {
            notification.error({
                message: translation(error.message)
            });
        } finally {
            loadingState.hide();
        }
    };
}
