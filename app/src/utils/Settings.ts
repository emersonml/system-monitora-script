import Prisma from '@services/Prisma';

export default class Settings {
    static async get(keys: string | string[]): Promise<{ [key: string]: string }> {
        const settings = await Prisma.settings.findMany({
            where: keys?.length > 0 ? { key: typeof keys == 'string' ? { startsWith: keys } : { in: keys } } : undefined
        });

        const result = {};
        for (const { key, value } of settings) {
            result[key] = value;
        }
        return result;
    }

    static set(settings: string[][]) {
        return Prisma.$transaction(
            settings.map(([key, value]) =>
                Prisma.settings.upsert({
                    where: { key },
                    create: { key, value },
                    update: { value }
                })
            )
        );
    }
}
