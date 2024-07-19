import { createInitialState, createState } from '@states/index';

const INITIAL_STATE = createInitialState({
    visible: false,
    type: '',
    title: '',
    url: ''
});

export default function useDocumentViewerState() {
    const [state, setState] = createState(INITIAL_STATE);

    function show({ title = '', type = '', url = '' }) {
        setState(state => {
            state.visible = true;
            state.type = type;
            state.title = title;
            state.url = url;
        });
    }

    function hide() {
        setState(state => {
            state.visible = false;
            state.type = '';
            state.title = '';
            state.url = '';
        });
    }

    return {
        ...state,
        show,
        hide
    };
}
