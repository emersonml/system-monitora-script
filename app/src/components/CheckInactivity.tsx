import { useEffect, useRef } from 'react';

import { notification } from 'antd';
import { addMilliseconds, isAfter, parseISO } from 'date-fns';

import useSession from '@hooks/Session';
import EnvironmentApi from '@services/Api/EnvironmentApi';
import useAuthState from '@states/AuthState';
import useInactivityState from '@states/InactivityState';
import useTranslationState from '@states/TranslationState';
import { EXPIRATION_TIME_KEY } from '@utils/Constant';
import Storage from '@utils/Storage';

export default function CheckInactivity() {
    const authState = useAuthState();
    const checkInactivityState = useInactivityState();
    const { translation } = useTranslationState();

    const idleTime = useRef<number>(null);
    const timeoutGlobal = useRef<number>();
    const timeoutLogout = useRef<number>();

    const session = useSession();

    useEffect(() => {
        async function refresh() {
            if (!idleTime.current) {
                const environment = await EnvironmentApi.getWithPromise().catch(() => null);
                idleTime.current = (environment?.idleTime ?? 60) * 60000;
            }

            notification.close('InactivityMessage');
            clearTimeout(timeoutLogout.current);
            clearTimeout(timeoutGlobal.current);

            timeoutGlobal.current = window.setTimeout(() => {
                timeoutLogout.current = window.setTimeout(async () => {
                    document.removeEventListener('click', refresh);

                    session.logout();
                }, 5000);

                notification.warn({
                    key: 'InactivityMessage',
                    message: translation('Você está inativo por muito tempo, sua sessão irá expirar'),
                    description: translation('Clique aqui para continuar logado'),
                    duration: 5,
                    onClick: () => {
                        refresh();
                    }
                });
            }, idleTime.current);

            Storage.set(EXPIRATION_TIME_KEY, addMilliseconds(new Date(), idleTime.current - 500));
        }

        const expirationTime = parseISO(Storage.get<string>(EXPIRATION_TIME_KEY, null));
        if (expirationTime && isAfter(new Date(), expirationTime)) {
            session.logout();
        } else if (checkInactivityState.running && authState.user) {
            refresh();
            document.addEventListener('click', refresh);
        }

        return () => {
            notification.close('InactivityMessage');
            clearTimeout(timeoutLogout.current);
            clearTimeout(timeoutGlobal.current);

            document.removeEventListener('click', refresh);
        };
    }, [checkInactivityState.running, authState.user]);

    return null;
}
