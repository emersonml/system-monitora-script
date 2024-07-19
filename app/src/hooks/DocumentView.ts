import { notification } from 'antd';

import useDocumentViewerState from '@states/DocumentViewerState';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import FileBrowser from '@utils/FileBrowser';
import Util from '@utils/Util';

export default function useDocumentView() {
    const loadingState = useLoadingState();
    const documentViewerState = useDocumentViewerState();
    const { translation } = useTranslationState();

    return async (title: string, url: string) => {
        try {
            loadingState.show();

            const type = Util.getExtName(url, true);
            const isDownload =
                window.innerWidth < 430 ||
                !/^pdf|txt|png|jpe?g|mp(3|4)|tiff?|docx?|odt|csv|xlsx?|ods|pptx?|odp$/i.test(type);

            if (isDownload) {
                FileBrowser.save(url, title);
            } else {
                documentViewerState.show({
                    type,
                    title,
                    url
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
