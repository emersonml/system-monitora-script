import * as PrismaTypes from '@prisma/client';

const Prisma: PrismaTypes.PrismaClient = global.Prisma || new PrismaTypes.PrismaClient();
if (process.env.NODE_ENV === 'development') global.Prisma = Prisma;

export { PrismaTypes };
export default Prisma;
