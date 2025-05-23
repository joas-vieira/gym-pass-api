import { Gym, Prisma } from 'generated/prisma';

export interface GymRepository {
  findById(id: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
