import { NextApiRequest, NextApiResponse } from 'next';

import { parseSort } from '@hooks/SortTable';
import Prisma, { PrismaTypes } from '@services/Prisma';

export default class AuditController {
    static async list(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['menu_audit']);

        const page = Number(req.query.page);
        const size = Number(req.query.size);
        const sort = String(req.query.sort || '-date');
        const search = req.query.search as string;
        const author = req.query.author as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        const isPaginate = !Number.isNaN(page) && !Number.isNaN(size);
        const where: PrismaTypes.Prisma.AuditWhereInput = {
            authorId: author == 'all' ? undefined : author,
            description: search ? { contains: search } : undefined,
            date:
                startDate || endDate
                    ? {
                          gte: startDate,
                          lte: endDate
                      }
                    : undefined
        };

        const audits = await Prisma.audit.findMany({
            where,
            include: {
                author: {
                    select: { name: true }
                }
            },
            orderBy: parseSort(sort),
            skip: isPaginate ? (page - 1) * size : undefined,
            take: isPaginate ? size : undefined
        });

        res.setHeader('x-total-count', isPaginate ? await Prisma.audit.count({ where }) : audits.length);

        res.json(
            audits.map(audit => ({
                id: audit.id,
                date: audit.date,
                author: audit.author?.name || null,
                action: audit.action,
                description: audit.description,
                model: audit.modelName,
                ipAddress: audit?.ipAddress
            }))
        );
    }
}
