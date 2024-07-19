import { notification } from 'antd';
import axios from 'axios';
import https from 'https';

import { API_CUSTODY_YARD_URL } from '@utils/Environment';

const api = axios.create({
    baseURL: API_CUSTODY_YARD_URL,
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

api.interceptors.request.use(async config => {
    const token = localStorage.getItem('i9-erp:token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token.replace(/"/g, '')}`;
    } else if (config.headers) {
        config.headers.Authorization = null;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.log('error.response', error.response);
        if (error.response && error.response.status === 403) {
            notification.error({
                message: 'Permissão insuficiente',
                description: 'Você não possui permissão para acessar este recurso.'
            });
        }
        return Promise.reject(error);
    }
);

const apiCustodyYarn = api;

export default apiCustodyYarn;
