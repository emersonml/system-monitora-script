import { NextApiRequest, NextApiResponse } from 'next';

export default class DashboardController {
    static async list(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['menu_dashboard']);

        const result = {
            count: {}
        };

        res.json(result);
    }
}
