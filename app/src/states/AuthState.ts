import { createInitialState, createState } from '@states/index';
import { Capability } from '@utils/Constant';

type AuthState = {
    user: User | null;
};

export type User = {
    id: string;
    firstLogin?: boolean;
    name: string;
    email: string;
    roles: string[];
    capabilities: Capability[];
    companyId?: string;
};

const INITIAL_STATE = createInitialState<AuthState>({
    user: null
});

export default function useAuthState() {
    const [state, setState] = createState(INITIAL_STATE);

    function setUser(user: User) {
        setState(state => {
            state.user = user;
        });
    }

    function can(capabilities: Capability[], user?: User) {
        if (!user) {
            user = state.user;
        }

        if (user) {
            for (const capability of capabilities) {
                if (user.capabilities.includes(capability)) {
                    return true;
                }
            }
        }

        return false;
    }

    return {
        ...state,
        setUser,
        can
    };
}
