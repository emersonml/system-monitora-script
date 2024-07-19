import SingletonRouter, { Router, TransitionOptions, Url } from 'next/router';
import { useEffect } from 'react';

import useLoadingState from '@states/LoadingState';

type Props = {
    when: boolean;
    callback: (url: Url) => Promise<void>;
};

function change(method: 'push' | 'replace', url: Url, as?: Url, options?: TransitionOptions): Promise<boolean> {
    return Router.prototype[method].apply(SingletonRouter.router, [url, as, options]);
}

export default function NavigationPrompt({ when, callback }: Props) {
    const loadingState = useLoadingState();

    useEffect(() => {
        async function navigate(method: 'push' | 'replace', url: Url, as?: Url, options?: TransitionOptions) {
            if (when) {
                if (loadingState.loading) {
                    loadingState.hide();
                }

                return callback(url)
                    .then(() => change(method, url, as, options))
                    .catch(() => false);
            }

            return change(method, url, as, options);
        }

        SingletonRouter.router.push = (...args) => navigate('push', ...args);
        SingletonRouter.router.replace = (...args) => navigate('replace', ...args);

        return () => {
            delete SingletonRouter.router.push;
            delete SingletonRouter.router.replace;
        };
    }, [when, loadingState.loading]);

    return null;
}
