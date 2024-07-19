import { differenceInSeconds } from 'date-fns';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { TOKEN_SECRET } from '@utils/Environment';

type TokenError = {
    expired?: Error;
    invalid?: Error;
};

export default class Token {
    static async create(payload: Record<string, unknown>) {
        const Settings = (await import('@utils/Settings')).default;
        const settings = await Settings.get(['ENV_TOKEN_EXPIRATION']);

        return jwt.sign(payload, TOKEN_SECRET, {
            expiresIn: parseInt(settings.ENV_TOKEN_EXPIRATION) * 60 || 60
        });
    }

    static getData<T>(token: string, tokenError?: TokenError): T {
        try {
            return jwt.verify(token, TOKEN_SECRET) as Record<string, unknown> as T;
        } catch (error) {
            if (error instanceof TokenExpiredError && tokenError.expired) {
                throw tokenError.expired;
            }

            if (tokenError.invalid) {
                throw tokenError.invalid;
            }

            throw error;
        }
    }

    static expiration(token: string) {
        const data = jwt.decode(token) as { exp: number };

        if (!data) return 0;

        return differenceInSeconds(data.exp * 1000, new Date());
    }
}
