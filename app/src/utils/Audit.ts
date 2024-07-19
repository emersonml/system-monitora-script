import Prisma, { PrismaTypes } from '@services/Prisma';

type Log = {
    authorId: string;
    action: PrismaTypes.AuditActionEnum;
    description: string;
    modelId: string;
    modelName: PrismaTypes.AuditModelEnum;
    ipAddress?: string;
};

export default class Audit {
    static async log(data: Log) {
        return Prisma.audit.create({ data }).catch(() => null);
    }
}
