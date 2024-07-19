import bcrypt from 'bcryptjs';

import Prisma, { PrismaTypes } from '../src/services/Prisma';
import { CAPABILITIES, Capability } from '../src/utils/Constant';

function hash(value: string, salt = 8) {
    return bcrypt.hash(value, salt);
}

(async () => {
    try {
        // Settings
        const settings: PrismaTypes.Prisma.SettingsCreateInput[] = [
            { key: 'ENV_TITLE', value: 'Gestão Câmeras' },
            { key: 'ENV_COMPANY_NAME', value: 'Câmeras' },
            { key: 'ENV_TOKEN_EXPIRATION', value: '1440' },
            { key: 'ENV_IDLE_TIME', value: '10' },
            { key: 'ENV_FAVICON', value: '/images/32.png' },
            { key: 'ENV_LOGIN_TITLE', value: '' },
            { key: 'ENV_LOGIN_LOGO', value: '/images/270x270.png' },
            { key: 'ENV_HEADER_LOGO', value: '/images/270x64.jpg' },
            { key: 'ENV_BACKGROUND_LOGIN', value: '/images/1024x768-02.png' },
            { key: 'ENV_REPORT_LOGO', value: '/images/177x80.png' },
            { key: 'ENV_REPORT_HEADER_BACKGROUND', value: '' },
            { key: 'ENV_REPORT_HEADER_TEXT', value: 'Câmeras' },
            { key: 'ENV_REPORT_FOOTER_BACKGROUND', value: '' },
            { key: 'ENV_REPORT_FOOTER_TEXT', value: '' },
            { key: 'ENV_SALES_FUNNEL_DATE_COLOR_CARDS', value: '0-10;#92d050 | 11-30;#ffc000 | 31-*;#ea4335' },
            { key: 'ENV_DOCUMENT_MAX_UPLOAD_SIZE', value: '10' },
            { key: 'ENV_ORDER_STATUS_BUDGET', value: '' }
        ];
        await Promise.all(
            settings.map(setting =>
                Prisma.settings.upsert({
                    where: { key: setting.key },
                    create: setting,
                    update: {}
                })
            )
        );

        // Capabilities
        const capabilities = await Prisma.capability.findMany();
        const removeIds = [];
        for (const capability of capabilities) {
            if (!CAPABILITIES.includes(capability.id as Capability)) {
                removeIds.push(capability.id);
            }
        }
        await Prisma.capability.deleteMany({
            where: {
                id: { in: removeIds }
            }
        });

        // Roles
        const roles: PrismaTypes.Prisma.RoleCreateInput[] = [
            {
                id: 'administrator',
                name: 'Administrador',
                level: 1,
                capabilities: {
                    connectOrCreate: CAPABILITIES.map(id => ({
                        where: { id },
                        create: { id }
                    }))
                }
            }
        ];
        await Promise.all(
            roles.map(role =>
                Prisma.role.upsert({
                    where: { id: role.id },
                    create: role,
                    update: role
                })
            )
        );

        // User admin
        const userAdmin: PrismaTypes.Prisma.UserCreateInput = {
            name: 'Administrador',
            username: 'admin',
            email: 'admin@gmail.com',
            password: await hash('pw@admin'),
            roles: {
                connect: { id: roles[0].id }
            }
        };
        await Prisma.user.upsert({
            where: { username: 'admin' },
            create: userAdmin,
            update: userAdmin
        });
    } catch (error) {
        console.error(error);
    } finally {
        await Prisma.$disconnect();
    }
})();
