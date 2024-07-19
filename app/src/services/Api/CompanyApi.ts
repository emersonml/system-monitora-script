import { Paginate } from 'axios';

import Api from '@services/Api';
import { queryClient, useQuery } from '@services/QueryClient';

type ListArgs = {
    page?: number;
    size?: number;
    search?: string;
};

export type ListCompany = {
    id: string;
    cnpj?: string;
    name?: string;
    address?: string;
    phone?: string;
    company?: {
        name?: string;
    };
};

export type CreateOrUpdateCompany = {
    id?: string;
    cnpj?: string;
    name?: string;
    address?: string;
    phone?: string;
    users?: {
        id: string;
        name?: string;
        roles?: string[];
    }[];
};

export default class CompanyApi {
    static list(args?: ListArgs) {
        return useQuery(['company', args], () => CompanyApi.listWithPromise(args));
    }

    static listWithPromise(args?: ListArgs) {
        return Api.get<Paginate<ListCompany[]>>('company', {
            params: {
                page: args?.page,
                size: args?.size,
                search: args?.search
            }
        });
    }

    static async create(company: CreateOrUpdateCompany) {
        company = await Api.post<CreateOrUpdateCompany>('company', company);
        queryClient.invalidateQueries('company');
        return company;
    }

    static async update(company: CreateOrUpdateCompany) {
        company = await Api.put<CreateOrUpdateCompany>(`company/${company.id}`, company);
        queryClient.invalidateQueries('company');
        return company;
    }

    static async delete(id: string) {
        await Api.delete(`company/${id}`);
        queryClient.invalidateQueries('company');
    }

    static get(id: string) {
        return useQuery(['company', id], () => CompanyApi.getWithPromise(id));
    }

    static async getWithPromise(id: string) {
        if (!id || id == 'new') {
            return {} as CreateOrUpdateCompany;
        }
        return Api.get<CreateOrUpdateCompany>(`company/${id}`);
    }
}
