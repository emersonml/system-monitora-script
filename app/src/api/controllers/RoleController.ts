import { NextApiRequest, NextApiResponse } from 'next';

import Prisma from '@services/Prisma';
import ApiError from '@utils/ApiError';
import Audit from '@utils/Audit';
import Util from '@utils/Util';

export default class RoleController {
    static async list(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['permission_view']);

        const search = req.query.search as string;

        const user = await Prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                roles: {
                    select: {
                        level: true
                    }
                }
            }
        });
        const levels = user.roles.map(role => role.level).filter(level => level != null);
        const level = levels.length == 0 ? 9999 : Math.max(...levels);

        const roles = await Prisma.role.findMany({
            where: {
                name: search ? { contains: search } : undefined,
                OR: [{ level: { gte: level } }, { level: { equals: null } }]
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.json(roles);
    }

    static async create(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['permission_create']);

        let { id, name, level } = req.body as { id: string; name: string; level: number };

        if (!id) {
            id = name;
        }
        id = Util.slug(id);

        {
            const role = await Prisma.role.findUnique({
                where: { id },
                select: { id: true }
            });

            if (role) {
                throw new ApiError('Função já cadastrada', 400);
            }
        }

        const role = await Prisma.role.create({
            data: {
                id,
                name,
                level
            }
        });

        await Audit.log({
            authorId: req.userId,
            action: 'create',
            description: role.name,
            modelId: role.id,
            modelName: 'role'
        });

        res.status(201).json(role);
    }

    static async get(req: NextApiRequest, res: NextApiResponse) {
        const { id: paramId } = req.params;

        const role = await Prisma.role.findUnique({
            where: { id: paramId }
        });

        res.json(role);
    }

    static async update(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['permission_edit']);

        const { id: paramId } = req.params;
        let { id, name, level } = req.body as { id: string; name: string; level: number };

        if (!id) {
            id = name;
        }
        id = Util.slug(id);

        {
            const role = await Prisma.role.findUnique({
                where: { id: paramId },
                select: { id: true }
            });

            if (!role) {
                throw new ApiError('Função não encontrada', 400);
            }
        }

        {
            const role = await Prisma.role.findUnique({
                where: { id },
                select: { id: true }
            });

            if (role && role.id != paramId) {
                throw new ApiError('Função já cadastrada', 400);
            }
        }

        const role = await Prisma.role.update({
            where: { id: paramId },
            data: {
                id,
                name,
                level
            }
        });

        await Audit.log({
            authorId: req.userId,
            action: 'edit',
            description: role.name,
            modelId: role.id,
            modelName: 'role'
        });

        res.json(role);
    }

    static async delete(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['permission_delete']);

        const { id: paramId } = req.params;

        const role = await Prisma.role.findUnique({
            where: { id: paramId },
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!role) {
            throw new ApiError('Função não encontrada', 400);
        }

        if (role.users.length > 0) {
            throw new ApiError('Essa função não pode ser excluída, pois existe usuários associados a ela', 400);
        }

        await Prisma.role.delete({
            where: { id: paramId }
        });

        await Audit.log({
            authorId: req.userId,
            action: 'delete',
            description: role.name,
            modelId: role.id,
            modelName: 'role'
        });

        res.status(204).end();
    }

    static async getCapabilities(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['permission_view']);

        const { id: paramId } = req.params;

        const role = await Prisma.role.findUnique({
            where: { id: paramId },
            select: {
                capabilities: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!role) {
            throw new ApiError('Função não encontrada', 400);
        }

        res.json(role.capabilities.map(capability => capability.id));
    }

    static async updateCapabilities(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['permission_edit']);

        const { id: paramId } = req.params;
        const capabilities = req.body as string[];

        {
            const role = await Prisma.role.findUnique({
                where: { id: paramId },
                select: { id: true }
            });

            if (!role) {
                throw new ApiError('Função não encontrada', 400);
            }
        }

        const role = await Prisma.role.update({
            where: { id: paramId },
            data: {
                capabilities: {
                    set: capabilities.map(capability => ({
                        id: capability
                    }))
                }
            },
            include: {
                capabilities: true
            }
        });

        await Audit.log({
            authorId: req.userId,
            action: 'edit',
            description: role.name,
            modelId: role.id,
            modelName: 'capability'
        });

        res.json(role.capabilities.map(capability => capability.id));
    }
}
