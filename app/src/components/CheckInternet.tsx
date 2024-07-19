import { useEffect } from 'react';

import { notification } from 'antd';

import useTranslationState from '@states/TranslationState';

export default function CheckInactivity() {
    const { translation } = useTranslationState();

    useEffect(() => {
        function handleOnline() {
            notification.close('OfflineMessage');
        }

        function handleOffline() {
            notification.warn({
                key: 'OfflineMessage',
                message: translation('Não foi possível acessar o servidor'),
                description: translation('Verifique sua conexão com a internet'),
                duration: 0,
                closeIcon: <div />
            });
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            notification.close('OfflineMessage');
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return null;
}
