import Api from '@services/Api';
import { useQuery } from '@services/QueryClient';

export type ListDashboard = {
    count: Count;
    folders?: {
        created: number;
        edited: number;
        deleted: number;
    };
    documents?: {
        created: number;
        edited: number;
        deleted: number;
    };
};

export type Count = {
    orders?: number;
    products?: number;
    productsCategories?: number;
    customers?: number;
    vendors?: number;
    employees?: number;
    documents?: number;
    favoritesDocuments?: number;
};

export default class DashboardApi {
    static list() {
        return useQuery(['dashboard'], () => Api.get<ListDashboard>('dashboard'));
    }
}
