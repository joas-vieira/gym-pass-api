import { GymRepository } from '@/repositories/gym.repository';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';

describe('Search Gyms Use Case', () => {
  let gymRepository: GymRepository;
  let sut: SearchGymsUseCase;

  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository();
    sut = new SearchGymsUseCase(gymRepository);
  });

  it('should be able to search for gyms by name', async () => {
    await gymRepository.create({
      name: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    });

    await gymRepository.create({
      name: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    });

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'JavaScript Gym' })
      ])
    );
  });

  it('should be able to search for paginated gyms by name', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        name: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0
      });
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'JavaScript Gym 21' }),
        expect.objectContaining({ name: 'JavaScript Gym 22' })
      ])
    );
  });
});
