import produce, { Draft } from 'immer';
import { atom, RecoilState, useRecoilState } from 'recoil';

import Util from '@utils/Util';

type SetState<T> = (setState: ((state: Draft<T>) => void) | T) => void;

export function createInitialState<T>(initialState: T) {
    return atom<T>({
        key: Util.uuid(),
        default: initialState
    });
}

export function createState<T>(initialState: RecoilState<T>): [T, SetState<T>] {
    const [state, setState] = useRecoilState(initialState);

    return [
        state,
        state => {
            if (state instanceof Function) {
                setState(produce<T>(state));
            } else {
                setState(state);
            }
        }
    ];
}
