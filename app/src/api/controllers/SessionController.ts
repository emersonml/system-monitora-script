import { NextApiRequest, NextApiResponse } from 'next';

import Prisma from '@services/Prisma';
import ApiError from '@utils/ApiError';
import Audit from '@utils/Audit';
import { Capability } from '@utils/Constant';
import Token from '@utils/Token';
import Util from '@utils/Util';

export default class SessionController {
    static async create(req: NextApiRequest, res: NextApiResponse) {
        const { email: emailOrUserName, password } = req.body as { email: string; password: string };

        if (!emailOrUserName || !password) {
            throw new ApiError('E-mail e/ou senha incorreto(s)', 403);
        }

        let user = await Prisma.user.findUnique({
            where: { email: emailOrUserName },
            select: {
                id: true,
                email: true,
                password: true,
                passwordRecovery: true,
                roles: {
                    select: {
                        capabilities: true
                    }
                }
            }
        });

        if (!user) {
            user = await Prisma.user.findUnique({
                where: { username: emailOrUserName },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    passwordRecovery: true,
                    roles: {
                        select: {
                            capabilities: true
                        }
                    }
                }
            });

            if (!user) {
                throw new ApiError('E-mail e/ou senha incorreto(s)', 403);
            }
        }

        if (user.passwordRecovery && (await Util.checkHash(password, user.passwordRecovery))) {
            await Prisma.user.update({
                where: { id: user.id },
                data: {
                    password: user.passwordRecovery,
                    passwordRecovery: null
                }
            });
            user.passwordRecovery = null;
        } else if (!(await Util.checkHash(password, user.password))) {
            throw new ApiError('E-mail e/ou senha incorreto(s)', 403);
        }

        if (user.passwordRecovery) {
            await Prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordRecovery: null
                }
            });
        }

        const capabilities: Capability[] = [];
        for (const role of user.roles) {
            capabilities.push(...role.capabilities.map(capability => capability.id as Capability));
        }
        if (!capabilities.includes('user_login')) {
            throw new ApiError('Sem permissão para logar no sistema', 403);
        }

        await Audit.log({
            authorId: user.id,
            action: 'login',
            description: user.email,
            modelId: user.id,
            modelName: 'session',
            ipAddress: Util.findUserIp(req)
        });

        res.json({
            token: await Token.create({ id: user.id })
        });
    }

    static async delete(req: NextApiRequest, res: NextApiResponse) {
        const user = await Prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true
            }
        });

        await Audit.log({
            authorId: user.id,
            action: 'logout',
            description: user.name,
            modelId: user.id,
            modelName: 'session',
            ipAddress: Util.findUserIp(req)
        });

        res.status(204).end();
    }
}
