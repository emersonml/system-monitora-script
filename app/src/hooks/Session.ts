import { useRouter } from 'next/router';

import SessionApi from '@services/Api/SessionApi';
import useAuthState from '@states/AuthState';
import useLoadingState from '@states/LoadingState';
import { EXPIRATION_TIME_KEY, TOKEN_KEY } from '@utils/Constant';
import Storage from '@utils/Storage';

export default function useSession() {
    const loadingState = useLoadingState();
    const authState = useAuthState();

    const router = useRouter();

    return {
        async logout() {
            try {
                await loadingState.show();

                SessionApi.logout();

                Storage.remove(TOKEN_KEY);
                Storage.remove(EXPIRATION_TIME_KEY);
                authState.setUser(null);

                router.push('/login');
            } catch (error) {
                console.error(error);
            }
        }
    };
}
