import Axios, { AxiosError } from 'axios';

import { IS_WEB } from '@utils/Constant';

const Api = Axios.create({
    baseURL: '/api'
});

Api.interceptors.request.use(config => {
    if (IS_WEB) {
        config.headers.Server = window?.location?.origin;
    }

    return config;
});

Api.interceptors.response.use(
    ({ headers, data }) => {
        const total = headers['x-total-count'] || headers['x-wp-totalpages'];

        if (total != null) {
            return {
                total: parseInt(total),
                list: data
            };
        }

        return data;
    },
    (error: AxiosError<{ message?: string }>) => {
        const message = error?.response?.data?.message || 'Ocorreu um erro';

        if (error?.response?.status == 401 && IS_WEB) {
            setTimeout(() => {
                window.location.href = '/login';
            }, 4000);
        }

        return Promise.reject(new Error(message));
    }
);

export default Api;
