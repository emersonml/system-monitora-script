import Api from '@services/Api';
import { queryClient, useQuery } from '@services/QueryClient';

export type Environment = {
    title?: string;
    companyName?: string;
    jwtExpiration?: number;
    idleTime?: number;
    loginTitle?: string;
    favicon?: string;
    loginLogo?: string;
    headerLogo?: string;
    backgroundLogin?: string;
    reportLogo?: string;
    reportHeaderBackground?: string;
    reportHeaderText?: string;
    reportFooterBackground?: string;
    reportFooterText?: string;
    documentMaxUploadSize?: number;
    orderStatusBudget?: string;
    customTitle?: string;
    customFavicon?: string;
    customLoginLogo?: string;
    customHeaderLogo?: string;
    customBackgroundLogin?: string;
};

export default class EnvironmentApi {
    static get() {
        return useQuery(['environments'], () => EnvironmentApi.getWithPromise());
    }

    static getWithPromise() {
        return Api.get<Environment>('environments');
    }

    static async update(environment: Environment) {
        environment = await Api.put<Environment>('environments', environment);

        queryClient.invalidateQueries('environments');

        return environment;
    }
}
