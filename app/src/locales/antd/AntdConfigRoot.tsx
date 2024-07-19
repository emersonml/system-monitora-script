import { ReactNode, useContext } from 'react';

import { ConfigProvider } from 'antd';
import en from 'antd/lib/locale/en_US';
import pt from 'antd/lib/locale/pt_BR';

import useTranslationState from '@states/TranslationState';

type ProviderProps = {
    children: ReactNode;
};

pt.Form.defaultValidateMessages.required = 'Campo obrigatório';

en.Form.defaultValidateMessages.required = 'Required field';

export function AntdConfigRoot({ children }: ProviderProps) {
    const { language } = useTranslationState();

    const locale = language == 'pt' ? pt : en;

    return <ConfigProvider locale={locale}>{children}</ConfigProvider>;
}

export function useAntdConfig() {
    return useContext(ConfigProvider.ConfigContext);
}
