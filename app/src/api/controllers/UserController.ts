/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';

import { filterCapabilities } from '@api/controllers/CapabilityController';
import Email from '@services/Email';
import Prisma, { PrismaTypes } from '@services/Prisma';
import ApiError from '@utils/ApiError';
import Audit from '@utils/Audit';
import Util from '@utils/Util';

import { createUrl } from './AttachmentController';

export default class UserController {
    static async list(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['user_view']);

        const page = Number(req.query.page);
        const size = Number(req.query.size);
        const search = req.query.search as string;
        const role = req.query.role as string;

        const isPaginate = !Number.isNaN(page) && !Number.isNaN(size);
        const where: PrismaTypes.Prisma.UserWhereInput = {
            name: search ? { contains: search } : undefined,
            roles:
                !role || role == 'all'
                    ? undefined
                    : {
                          some: { id: role }
                      }
        };

        const users = await Prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                phone: true,
                roles: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            },
            skip: isPaginate ? (page - 1) * size : undefined,
            take: isPaginate ? size : undefined
        });

        res.setHeader('x-total-count', isPaginate ? await Prisma.user.count({ where }) : users.length);

        res.json(
            await Promise.all(
                users.map(user => ({
                    ...user,
                    roles: user?.roles?.map(role => role?.name)
                }))
            )
        );
    }

    static async create(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['user_create']);

        const { name, cpf, email, phone, username, password, roles } = req.body as {
            name: string;
            cpf: string;
            email: string;
            phone: string;
            username: string;
            password: string;
            vestSize?: string;
            roles: string[];
        };

        if (username) {
            const user = await Prisma.user.findUnique({
                where: { username },
                select: { id: true }
            });

            if (user) {
                throw new ApiError('Usuário já existe', 400);
            }
        }

        if (email) {
            const user = await Prisma.user.findUnique({
                where: { email },
                select: { id: true }
            });

            if (user) {
                throw new ApiError('E-mail já existente', 400);
            }
        }

        const user = await Prisma.user.create({
            data: {
                name,
                cpf,
                email,
                phone,
                username,
                password: password ? await Util.hash(password) : undefined,
                roles: {
                    connect: roles.map(role => ({
                        id: role
                    }))
                },
                firstLogin: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                roles: {
                    select: {
                        id: true
                    }
                }
            }
        });

        await Audit.log({
            authorId: req.userId,
            action: 'create',
            description: user.name,
            modelId: user.id,
            modelName: 'user'
        });

        res.status(201).json({
            ...user,
            roles: user.roles.map(role => role.id)
        });
    }

    static async update(req: NextApiRequest, res: NextApiResponse) {
        const { id: paramId } = req.params;

        if (req.userId != paramId) {
            await req.can(['user_edit']);
        }

        const { name, cpf, email, phone, username, password, roles } = req.body as {
            name: string;
            cpf: string;
            email: string;
            phone: string;
            username: string;
            password: string;
            vestSize: string;
            roles: string[];
        };

        {
            const user = await Prisma.user.findUnique({
                where: { id: paramId },
                select: { id: true }
            });

            if (!user) {
                throw new ApiError('Usuário não encontrado', 400);
            }
        }

        if (username) {
            const user = await Prisma.user.findUnique({
                where: { username },
                select: { id: true }
            });

            if (user && user.id != paramId) {
                throw new ApiError('Usuário já existe', 400);
            }
        }

        if (email) {
            const user = await Prisma.user.findUnique({
                where: { email },
                select: { id: true }
            });

            if (user && user.id != paramId) {
                throw new ApiError('E-mail já existente', 400);
            }
        }

        const user = await Prisma.user.update({
            where: { id: paramId },
            data: {
                name,
                cpf,
                email,
                phone,
                username,
                password: password ? await Util.hash(password) : undefined,
                roles: roles
                    ? {
                          set: roles.map(role => ({
                              id: role
                          }))
                      }
                    : {}
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                firstLogin: true,
                roles: {
                    select: {
                        id: true
                    }
                }
            }
        });

        await Audit.log({
            authorId: req.userId,
            action: 'edit',
            description: user.name,
            modelId: user.id,
            modelName: 'user'
        });

        res.json({
            ...user,
            roles: user.roles.map(role => role.id)
        });
    }

    static async delete(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['user_delete']);
        await deleteUser(req, 'user', 'Usuário não encontrado');
        res.status(204).end();
    }

    static async me(req: NextApiRequest, res: NextApiResponse) {
        const user = await Prisma.user.findUnique({
            where: {
                id: req.userId
            },
            include: {
                roles: {
                    select: {
                        id: true,
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
            throw new ApiError('Usuário não encontrado', 400);
        }

        let roles: string[] = [];
        let capabilities: string[] = [];
        for (const role of user.roles) {
            roles.push(role.id);
            capabilities.push(...role.capabilities.map(capability => capability.id));
        }

        roles = Util.removeDuplicate<string>(roles, id => id);
        capabilities = Util.removeDuplicate<string>(capabilities, id => id);
        capabilities = filterCapabilities(capabilities);

        roles.sort((a, b) => a.localeCompare(b));
        capabilities.sort((a, b) => a.localeCompare(b));

        res.json({
            ...user,
            roles,
            capabilities
        });
    }

    static async get(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['user_view']);

        const { id: paramId } = req.params;

        const user = await Prisma.user.findUnique({
            where: { id: paramId },
            include: {
                attachments: true,
                roles: {
                    select: {
                        id: true
                    }
                }
            }
        });
        delete user.password;
        delete user.passwordRecovery;

        if (!user) {
            throw new ApiError('Usuário não encontrado', 400);
        }

        res.json({
            ...user,
            roles: user.roles.map(role => role.id),
            attachments: await Promise.all(
                user.attachments.map(async attachment => ({
                    id: attachment.id,
                    filename: attachment.filename,
                    typeName: attachment?.typeName,
                    url: await createUrl(req.headers.server, req.userId, attachment.path)
                }))
            )
        });
    }

    static async recoverPassword(req: NextApiRequest | { body: { email: string } }, res: NextApiResponse | null) {
        const { email } = req.body;

        const user = await Prisma.user.findFirst({
            where: { email },
            select: {
                id: true,
                name: true
            }
        });

        if (!user) {
            throw new ApiError('E-mail não encontrado', 400);
        }

        const password = Util.randomString(8);

        await Email.recoverPassword({
            email,
            name: user.name,
            password
        });

        await Prisma.user.update({
            where: { id: user.id },
            data: {
                passwordRecovery: await Util.hash(password)
            }
        });

        if (res) {
            res.status(200).end();
        }
    }
}

export async function deleteUser(req: NextApiRequest, modelName: PrismaTypes.AuditModelEnum, message: string) {
    const { id: paramId } = req.params;

    const user = await Prisma.user.findUnique({
        where: { id: paramId },
        select: {
            id: true,
            name: true
        }
    });

    if (!user) {
        throw new ApiError(message, 400);
    }

    await Prisma.$transaction(
        [
            Prisma.audit.deleteMany({
                where: { authorId: user.id }
            }),
            Prisma.user.delete({
                where: { id: user.id }
            })
        ].filter(Boolean)
    );

    await Audit.log({
        authorId: req.userId,
        action: 'delete',
        description: user.name,
        modelId: user.id,
        modelName
    });
}
