import { GymRepository } from '@/repositories/gym.repository';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymUseCase } from './create-gym';

describe('Create Gym Use Case', () => {
  let gymRepository: GymRepository;
  let sut: CreateGymUseCase;

  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    sut = new CreateGymUseCase(gymRepository);
  });

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      name: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
