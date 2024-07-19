import { createInitialState, createState } from '@states/index';
import Util from '@utils/Util';

const INITIAL_STATE = createInitialState({
    loading: false
});

export default function useLoadingState() {
    const [state, setState] = createState(INITIAL_STATE);

    async function show() {
        setState(state => {
            state.loading = true;
        });

        await Util.delay(100);
    }

    function hide() {
        setState(state => {
            state.loading = false;
        });
    }

    return {
        ...state,
        show,
        hide
    };
}
