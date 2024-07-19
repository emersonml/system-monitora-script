import { AxiosRequestConfig } from 'axios';

declare module 'axios' {
    type Paginate<T> = {
        total: number;
        list: T;
    };

    export interface HeadersDefaults {
        Authorization: string;
    }

    export interface AxiosInstance {
        post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
        get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
        put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
        delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    }
}
