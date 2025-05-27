import { GymRepository } from '@/repositories/gym.repository';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

describe('Fetch Nearby Gyms Use Case', () => {
  let gymRepository: GymRepository;
  let sut: FetchNearbyGymsUseCase;

  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository();
    sut = new FetchNearbyGymsUseCase(gymRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymRepository.create({
      name: 'Far Gym',
      description: null,
      phone: null,
      latitude: -23.37706193512421,
      longitude: -53.301014876883755
    });

    await gymRepository.create({
      name: 'Near Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    });

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Near Gym' })])
    );
  });
});
