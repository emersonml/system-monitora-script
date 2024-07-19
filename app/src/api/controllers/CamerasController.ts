/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';

import Prisma, { PrismaTypes } from '@services/Prisma';
import ApiError from '@utils/ApiError';

export default class UserController {
    static async list(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['user_view']);

        const page = Number(req.query.page);
        const size = Number(req.query.size);
        const search = req.query.search as string;
        const companyId = req.query.companyId as string;

        const isPaginate = !Number.isNaN(page) && !Number.isNaN(size);
        const where: PrismaTypes.Prisma.CamWhereInput = {
            companyId: companyId === 'all' ? undefined : companyId,
            name: search ? { contains: search } : undefined
        };

        const cameras = await Prisma.cam.findMany({
            where,
            include: {
                company: true
            },
            orderBy: {
                name: 'asc'
            },
            skip: isPaginate ? (page - 1) * size : undefined,
            take: isPaginate ? size : undefined
        });

        res.setHeader('x-total-count', isPaginate ? await Prisma.cam.count({ where }) : cameras.length);

        res.json(cameras);
    }

    static async create(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['user_create']);

        const { name, path, typeRecognition, adminInformation, position, companyId } = req.body as {
            name: string;
            path: string;
            typeRecognition: string;
            adminInformation: string;
            position: string;
            companyId: string;
        };

        const cameras = await Prisma.cam.create({
            data: {
                name,
                path,
                typeRecognition,
                adminInformation,
                position,
                companyId
            },
            select: {
                id: true,
                name: true
            }
        });

        res.status(201).json(cameras);
    }

    static async update(req: NextApiRequest, res: NextApiResponse) {
        const { id: paramId } = req.params;

        const { name, path, typeRecognition, adminInformation, position, companyId } = req.body as {
            name: string;
            path: string;
            typeRecognition: string;
            adminInformation: string;
            position: string;
            companyId: string;
        };

        {
            const cam = await Prisma.cam.findUnique({
                where: { id: paramId },
                select: { id: true }
            });

            if (!cam) {
                throw new ApiError('Câmera não encontrada', 400);
            }
        }

        const cam = await Prisma.cam.update({
            where: { id: paramId },
            data: {
                name,
                path,
                typeRecognition,
                adminInformation,
                position,
                companyId
            },
            select: {
                id: true,
                name: true
            }
        });

        res.json(cam);
    }

    static async delete(req: NextApiRequest, res: NextApiResponse) {
        // await deleteUser(req, 'user', 'Usuário não encontrado');
        res.status(204).end();
    }

    static async get(req: NextApiRequest, res: NextApiResponse) {
        const { id: paramId } = req.params;

        const camera = await Prisma.cam.findUnique({
            where: { id: paramId }
        });

        if (!camera) {
            throw new ApiError('Câmera não encontrada', 400);
        }

        res.json(camera);
    }
}
