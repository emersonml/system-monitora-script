import { NextApiRequest, NextApiResponse } from 'next';

import { json } from 'body-parser';

type NextFunction = (err?: unknown) => void;

export default async function bodyParser(req: NextApiRequest, res: NextApiResponse, next: NextFunction) {
    let contentType = req.headers['content-type'];

    if (contentType) {
        contentType = contentType.split(';')[0].trim();

        if (contentType.includes('json')) {
            json()(req, res, next);
        } else {
            next();
        }
    } else {
        next();
    }
}
