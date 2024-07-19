import { Paginate } from 'axios';

import Api from '@services/Api';
import { queryClient, useQuery } from '@services/QueryClient';
import { Capability } from '@utils/Constant';

import { Attachment } from './AttachmentApi';

type ListArgs = {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
};

export type Me = {
    id: string;
    firstLogin?: boolean;
    rhId: string;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    roles: string[];
    capabilities: Capability[];
};

export type VestType = {
    serie: string;
    dateReceived: Date;
    dateExpired: Date;
    expiredVest: boolean;
};

export type ListUser = {
    id: string;
    name: string;
    cpf: string;
    username: string;
    email: string;
    phone: string;
    roles: string[];
    onlyView: boolean;
};

export type CreateOrUpdateUser = {
    id?: string;
    firstLogin?: boolean;

    name?: string;
    cpf?: string;
    email?: string;
    username?: string;
    password?: string;
    roles?: string[];

    phoneResidential?: string;
    phone?: string;

    attachments?: Attachment[];
};

export default class UserApi {
    static list(args?: ListArgs) {
        return useQuery(['users', args], () => UserApi.listWithPromise(args));
    }

    static listWithPromise(args?: ListArgs) {
        return Api.get<Paginate<ListUser[]>>('users', {
            params: {
                page: args?.page,
                size: args?.size,
                search: args?.search,
                role: args?.role
            }
        });
    }

    static async create(user: CreateOrUpdateUser) {
        if (user.phone) {
            user.phone = user.phone.replace(/\D/g, '');
        }

        user = await Api.post<CreateOrUpdateUser>('users', user);

        queryClient.invalidateQueries('users');

        return user;
    }

    static async update(user: CreateOrUpdateUser) {
        if (user.phone) {
            user.phone = user.phone.replace(/\D/g, '');
        }

        user = await Api.put<CreateOrUpdateUser>(`users/${user.id}`, user);
        queryClient.invalidateQueries('users');

        return user;
    }

    static async delete(id: string) {
        await Api.delete(`users/${id}`);

        queryClient.invalidateQueries('users');
    }

    static me() {
        return useQuery(['users', 'me'], () => Api.get<Me>('users/me'));
    }

    static get(id: string) {
        return useQuery(['users', id], () => UserApi.getWithPromise(id));
    }

    static async getWithPromise(id: string) {
        if (!id || id == 'new') {
            return {} as CreateOrUpdateUser;
        }
        return Api.get<CreateOrUpdateUser>(`users/${id}`);
    }

    static recoverPassword(email: string) {
        return Api.post<void>('users/recover-password', { email });
    }
}
