import { Paginate } from 'axios';

import Api from '@services/Api';
import { queryClient, useQuery } from '@services/QueryClient';

type ListArgs = {
    page?: number;
    size?: number;
    search?: string;
    companyId?: string;
};

export type ListCam = {
    id: string;
    name: string;
    path: string;
    position: string;
    typeRecognition: string;
    adminInformation: string;
};

export type CreateOrUpdateCam = {
    id?: string;
    name?: string;
    path?: string;
    position?: string;
    typeRecognition?: string;
    adminInformation?: string;
    companyId?: string;
};

export default class CamApi {
    static list(args?: ListArgs) {
        return useQuery(['cameras', args], () => CamApi.listWithPromise(args));
    }

    static listWithPromise(args?: ListArgs) {
        return Api.get<Paginate<ListCam[]>>('cameras', {
            params: {
                page: args?.page,
                size: args?.size,
                search: args?.search,
                companyId: args?.companyId
            }
        });
    }

    static async create(user: CreateOrUpdateCam) {
        user = await Api.post<CreateOrUpdateCam>('cameras', user);
        queryClient.invalidateQueries('cameras');
        return user;
    }

    static async update(user: CreateOrUpdateCam) {
        user = await Api.put<CreateOrUpdateCam>(`cameras/${user.id}`, user);
        queryClient.invalidateQueries('cameras');
        return user;
    }

    static async delete(id: string) {
        await Api.delete(`cameras/${id}`);

        queryClient.invalidateQueries('cameras');
    }

    static get(id: string) {
        return useQuery(['cameras', id], () => CamApi.getWithPromise(id));
    }

    static async getWithPromise(id: string) {
        if (!id || id == 'new') {
            return {} as CreateOrUpdateCam;
        }
        return Api.get<CreateOrUpdateCam>(`cameras/${id}`);
    }
}
