import { randomUUID } from 'crypto';
import { Gym, Prisma } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';
import { GymRepository } from '../gym.repository';

export class InMemoryGymRepository implements GymRepository {
  private items: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString())
    };

    this.items.push(gym);

    return gym;
  }
}
