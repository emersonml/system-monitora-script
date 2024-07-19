import { ReactNode, useEffect } from 'react';

import { notification } from 'antd';
import {
    MutationFunction,
    QueryClientProvider,
    QueryFunction,
    QueryKey,
    QueryClient as ReactQueryClient,
    UseMutationOptions,
    UseQueryOptions,
    useMutation as useReactMutation,
    useQuery as useReactQuery
} from 'react-query';

import useTranslationState from '@states/TranslationState';

type ProviderProps = {
    children: ReactNode;
};

export const queryClient = new ReactQueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000, // 5s
            retry: false
        }
    }
});

export function QueryClientRoot({ children }: ProviderProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function useQuery<T>(queryKey: QueryKey, queryFn: QueryFunction<T>, options?: UseQueryOptions<T>) {
    const { translation } = useTranslationState();

    const result = useReactQuery<T, Error>(queryKey, queryFn, options);

    useEffect(() => {
        if (result.isError) {
            notification.error({
                message: translation(result.error.message)
            });
        }
    }, [result.isError]);

    return result;
}

export function useMutation<T, TVariables = undefined>(
    mutationKey: QueryKey,
    mutationFn: MutationFunction<T, TVariables>,
    options?: UseMutationOptions<T, Error, TVariables>
) {
    const { translation } = useTranslationState();

    const result = useReactMutation<T, Error, TVariables>(mutationKey, mutationFn, {
        ...options,
        onError: error => {
            notification.error({
                message: translation((error as Error).message)
            });
            options?.onError?.(error, undefined, undefined);
        }
    });

    return result;
}
