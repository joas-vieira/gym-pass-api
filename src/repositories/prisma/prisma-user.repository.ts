import { prisma } from '@/lib/prisma';
import { Prisma } from 'generated/prisma';
import { UserRepository } from '../user.repository';

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data });

    return user;
  }
}
