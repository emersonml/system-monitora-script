import { notification } from 'antd';
import { Content, PageOrientation, TDocumentDefinitions } from 'pdfmake/interfaces';

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
    pageOrientation?: PageOrientation;
};

type Extra = {
    footer?: Content | Content[];
};
type Callback = () => Return | Promise<Return>;

export default function useReport() {
    const loadingState = useLoadingState();
    const documentViewerState = useDocumentViewerState();
    const { translation } = useTranslationState();

    async function template(
        content: Content | Content[],
        extra: Extra,
        pageOrientation?: PageOrientation
    ): Promise<TDocumentDefinitions> {
        console.log('🚀 ~ useReport ~ pageOrientation:', pageOrientation);
        const environment = await EnvironmentApi.getWithPromise();

        const header: Content[] = [];
        const footer: Content[] = [];

        let hasLogo = false;
        let hasHeaderBackgroundImage = false;
        let hasFooterBackgroundImage = false;

        if (environment.reportHeaderBackground) {
            try {
                header.push({
                    image: await Util.imageUrlToBase64(environment.reportHeaderBackground),
                    width: 595,
                    height: 137
                });

                hasHeaderBackgroundImage = true;
            } catch (error) {
                hasHeaderBackgroundImage = false;
            }
        }

        if (environment.reportLogo) {
            try {
                header.push({
                    image: await Util.imageUrlToBase64(environment.reportLogo),
                    alignment: 'center',
                    width: 177,
                    height: 80,
                    margin: [0, hasHeaderBackgroundImage ? -107 : 30, 0, 0]
                });

                hasLogo = true;
            } catch (error) {
                hasLogo = false;
            }
        }

        if (environment.reportHeaderText) {
            header.push({
                text: environment.reportHeaderText,
                alignment: 'center',
                margin: [0, hasLogo ? 8 : hasHeaderBackgroundImage ? -107 : 30, 0, 0]
            });
        }

        if (environment.reportFooterBackground) {
            try {
                footer.push({
                    image: await Util.imageUrlToBase64(environment.reportFooterBackground),
                    width: 595,
                    height: 50
                });

                hasFooterBackgroundImage = true;
            } catch (error) {
                hasFooterBackgroundImage = false;
            }
        }

        if (environment.reportFooterText) {
            footer.push({
                text: environment.reportFooterText,
                alignment: 'center',
                margin: [30, hasFooterBackgroundImage ? -30 : 20, 30, 0]
            });
        }

        if (extra?.footer) {
            if (Array.isArray(extra.footer)) {
                footer.push(...extra.footer);
            } else {
                footer.push(extra.footer);
            }
        }

        return {
            pageMargins: [30, 145, 30, 50],
            background: header,
            content,
            footer,
            pageOrientation
        };
    }

    return async (callback: Callback) => {
        try {
            loadingState.show();

            const { title, content, extra, pageOrientation } = await callback();
            const config = await template(content, extra, pageOrientation);

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
