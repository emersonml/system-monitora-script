import i18n, { TOptions } from '@locales/i18n';
import { createInitialState, createState } from '@states/index';

export type Language = 'pt' | 'en';

export type Translation = (key: string, options?: TOptions) => string;

type TranslationState = {
    language: Language;
};

const INITIAL_STATE = createInitialState<TranslationState>({
    language: 'pt'
});

export default function useTranslationState() {
    const [state, setState] = createState(INITIAL_STATE);

    function translation(key: string, options?: TOptions) {
        key = key || '';
        options = {
            lng: state.language,
            interpolation: { escapeValue: false },
            ...options
        };

        if (key.includes(':')) {
            key = key.replace(/:/g, '{{colon}}');
            options.colon = ':';
        }

        return i18n.t(key, options);
    }

    function changeLanguage(language: Language) {
        setState(state => {
            state.language = language;
        });
    }

    return {
        ...state,
        translation,
        changeLanguage
    };
}
