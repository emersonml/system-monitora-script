import { NextApiRequest, NextApiResponse } from 'next';

import Prisma, { PrismaTypes } from '@services/Prisma';
import ApiError from '@utils/ApiError';

export default class CompanyController {
    static async list(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['user_view']);

        const page = Number(req.query.page);
        const size = Number(req.query.size);
        const search = req.query.search as string;

        const isPaginate = !Number.isNaN(page) && !Number.isNaN(size);
        const where: PrismaTypes.Prisma.CompanyWhereInput = {
            name: search ? { contains: search } : undefined
        };

        const companies = await Prisma.company.findMany({
            where,
            orderBy: {
                name: 'asc'
            },
            skip: isPaginate ? (page - 1) * size : undefined,
            take: isPaginate ? size : undefined
        });

        res.setHeader('x-total-count', isPaginate ? await Prisma.company.count({ where }) : companies.length);
        res.json(companies);
    }

    static async create(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['user_create']);

        const { name, address, phone, cnpj, users, cameras } = req.body as {
            name: string;
            address: string;
            phone: string;
            cnpj: string;
            users?: {
                id: string;
                name?: string;
                roles?: string[];
            }[];
            cameras?: {
                id: string;
                name?: string;
            }[];
        };

        const company = await Prisma.company.create({
            data: {
                name,
                address,
                phone,
                cnpj,
                users: users ? { connect: users.map(user => ({ id: user.id })) } : undefined,
                cameras: cameras ? { connect: cameras.map(cam => ({ id: cam.id })) } : undefined
            },
            select: {
                id: true
            }
        });

        res.status(201).json(company);
    }

    static async update(req: NextApiRequest, res: NextApiResponse) {
        const { id: paramId } = req.params;

        const { name, address, phone, cnpj, users, cameras } = req.body as {
            name: string;
            address: string;
            phone: string;
            cnpj: string;
            users?: {
                id: string;
                name?: string;
                roles?: string[];
            }[];
            cameras?: {
                id: string;
                name?: string;
            }[];
        };

        {
            const company = await Prisma.company.findUnique({
                where: { id: paramId },
                select: { id: true }
            });

            if (!company) {
                throw new ApiError('Empresa não encontrado', 400);
            }
        }

        const company = await Prisma.company.update({
            where: { id: paramId },
            data: {
                name,
                address,
                phone,
                cnpj,
                users: users
                    ? {
                          deleteMany: {
                              id: {
                                  notIn: users.map(user => user.id).filter(Boolean)
                              }
                          },
                          connect: users.map(user => ({ id: user?.id }))
                      }
                    : undefined,
                cameras: cameras
                    ? {
                          deleteMany: {
                              id: {
                                  notIn: cameras.map(cam => cam.id).filter(Boolean)
                              }
                          },
                          connect: cameras.map(cam => ({ id: cam?.id }))
                      }
                    : undefined
            },
            select: {
                id: true,
                name: true
            }
        });

        res.json(company);
    }

    static async delete(req: NextApiRequest, res: NextApiResponse) {
        // await deleteUser(req, 'user', 'Usuário não encontrado');
        res.status(204).end();
    }

    static async get(req: NextApiRequest, res: NextApiResponse) {
        const { id: paramId } = req.params;

        const company = await Prisma.company.findUnique({
            where: { id: paramId },
            include: {
                cameras: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        roles: true
                    }
                }
            }
        });

        if (!company) {
            throw new ApiError('Empresa não encontrada', 400);
        }

        const users = company?.users?.map(user => ({
            ...user,
            roles: user.roles.map(role => role.name)
        }));

        res.json({
            ...company,
            users
        });
    }
}
