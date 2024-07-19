import Api from '@services/Api';
import { useQuery } from '@services/QueryClient';
import { Capability } from '@utils/Constant';

type CapabilityArgs = {
    search?: string;
};

export default class CapabilityApi {
    static list(args?: CapabilityArgs) {
        return useQuery(['capabilities', args], () =>
            Api.get<Capability[]>('capabilities', {
                params: {
                    search: args?.search
                }
            })
        );
    }
}
