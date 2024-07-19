import { CamItem } from '@components/Form/InputCameraItems';
import Api from '@services/Api';
import { queryClient, useQuery } from '@services/QueryClient';
import { Capability } from '@utils/Constant';

type RoleArgs = {
    search?: string;
};

export type Role = {
    id?: string;
    name: string;
    level: number;
    cameras?: CamItem[];
};

export default class RoleApi {
    static list(args?: RoleArgs) {
        return useQuery(['roles', args], () =>
            Api.get<Role[]>('roles', {
                params: {
                    search: args?.search
                }
            })
        );
    }

    static async create(role: Role) {
        role = await Api.post<Role>('roles', role);

        queryClient.invalidateQueries('roles');

        return role;
    }

    static async update(role: Role, originalId?: string) {
        role = await Api.put<Role>(`roles/${originalId || role.id}`, role);

        queryClient.invalidateQueries('roles');

        return role;
    }

    static get(id: string) {
        return useQuery(['roles', id], () => RoleApi.getWithPromise(id));
    }

    static async getWithPromise(id: string) {
        if (!id || id == 'new') {
            return {} as Role;
        }
        return Api.get<Role>(`roles/${id}`);
    }

    static async delete(id: string) {
        await Api.delete(`roles/${id}`);

        queryClient.invalidateQueries('roles');
    }

    static getCapabilities(id: string) {
        return Api.get<Capability[]>(`roles/${id}/capabilities`);
    }

    static updateCapabilities(id: string, capabilities: Capability[]) {
        return Api.put<string[]>(`roles/${id}/capabilities`, capabilities);
    }
}
