import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const userRepository = {
  create: (data: any) => prisma.user.create({ data }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } })
};
