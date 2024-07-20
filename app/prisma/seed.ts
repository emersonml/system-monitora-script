import bcrypt from 'bcryptjs';

import Prisma, { PrismaTypes } from '../src/services/Prisma';
import { CAPABILITIES, Capability } from '../src/utils/Constants';

function hash(value: string, salt = 8) {
  return bcrypt.hash(value, salt);
}

(async () => {
  try {
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
        id: { in: removeIds },
      },
    });

    // Profile
    const profiles: PrismaTypes.Prisma.ProfileCreateInput[] = [
      {
        id: 'administrator',
        name: 'Administrador',
        description: 'Administrador',
        capabilities: {
          connectOrCreate: CAPABILITIES.map((id) => ({
            where: { id },
            create: { id },
          })),
        },
      },
    ];
    await Promise.all(
      profiles.map((profile) => Prisma.profile.upsert({
        where: { id: profile.id },
        create: profile,
        update: profile,
      })),
    );

    const userAdmin: PrismaTypes.Prisma.UserCreateInput = {
      name: 'Administrador',
      email: 'admin@dialink.com.br',
      password: await hash('pw@dialink'),
      profiles: {
        connect: { id: profiles[0].id },
      },
    };

    await Prisma.user.upsert({
      where: { email: 'admin@dialink.com.br' },
      create: userAdmin,
      update: userAdmin,
    });
  } catch (error) {
    console.error(error);
  } finally {
    await Prisma.$disconnect();
  }
})();
