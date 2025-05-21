import { Gym } from 'generated/prisma';
import { GymRepository } from '../gym.repository';

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
}
