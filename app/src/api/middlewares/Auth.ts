import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

import { filterCapabilities } from '@api/controllers/CapabilityController';
import Prisma from '@services/Prisma';
import ApiError from '@utils/ApiError';
import { Capability } from '@utils/Constant';
import Token from '@utils/Token';

type TokenData = {
    id: string;
};

export default function auth(ignoreError = false) {
    return async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
        let tokenData: TokenData = { id: null };

        try {
            const { authorization } = req.headers;
            if (!authorization) {
                throw new ApiError('Token não informado', 401);
            }

            const [, token] = authorization.split(' ');
            tokenData = Token.getData<TokenData>(token, {
                expired: new ApiError('Sua sessão expirou', 401),
                invalid: new ApiError('Token inválido', 401)
            });
        } catch (error) {
            if (!ignoreError) {
                throw error;
            }
        }

        req.userId = tokenData.id;
        req.can = async (capabilities: Capability[]) => {
            if (!req.capabilities) {
                const user = await Prisma.user.findUnique({
                    where: { id: tokenData.id },
                    select: {
                        roles: {
                            select: {
                                capabilities: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        }
                    }
                });

                if (!user) {
                    throw new ApiError('Usuário do token inválido', 401);
                }

                req.capabilities = [];
                for (const role of user.roles) {
                    req.capabilities.push(...role.capabilities.map(capability => capability.id as Capability));
                }
                req.capabilities = filterCapabilities(req.capabilities as string[]) as Capability[];
            }

            for (const capability of capabilities) {
                if (req.capabilities.includes(capability)) {
                    return;
                }
            }

            throw new ApiError(
                `Sem permissão para acessar esse recurso, necessário ter alguma(s) da(s) seguinte(s) capacidade(s): ${capabilities.join(
                    ', '
                )}`,
                403
            );
        };

        return next();
    };
}
