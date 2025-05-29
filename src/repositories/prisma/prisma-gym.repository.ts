import { prisma } from '@/lib/prisma';
import { Gym, Prisma } from 'generated/prisma';
import { FindManyNearbyParams, GymRepository } from '../gym.repository';

export class PrismaGymRepository implements GymRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({ where: { id } });

    return gym;
  }

  async findManyNearby({
    latitude,
    longitude
  }: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT
        * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: { name: { contains: query } },
      take: 20,
      skip: (page - 1) * 20
    });

    return gyms;
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({ data });

    return gym;
  }
}
