import { createInitialState, createState } from '@states/index';

const INITIAL_STATE = createInitialState({
    running: true
});

export default function useInnactivityState() {
    const [state, setState] = createState(INITIAL_STATE);

    function start() {
        setState(state => {
            state.running = true;
        });
    }

    function stop() {
        setState(state => {
            state.running = false;
        });
    }

    return {
        ...state,
        start,
        stop
    };
}
