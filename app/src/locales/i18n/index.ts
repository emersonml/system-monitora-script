import i18n, { TOptions } from 'i18next';

import en from '@locales/i18n/en.json';
import pt from '@locales/i18n/pt.json';

i18n.init({
    resources: {
        pt: { translation: pt },
        en: { translation: en }
    }
});

export default i18n;
export type { TOptions };
