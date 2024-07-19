import Api from '@services/Api';

export type LoginResult = {
    token: string;
};

export default class SessionApi {
    static async login(data: { email: string; password: string }) {
        return Api.post<LoginResult>('sessions', data);
    }

    static async logout() {
        return Api.delete('sessions').catch(() => null);
    }
}
