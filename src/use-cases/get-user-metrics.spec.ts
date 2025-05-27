import { CheckInRepository } from '@/repositories/check-in.repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserMetricsUseCase } from './get-user-metrics';

describe('Get User Metrics Use Case', () => {
  let checkInRepository: CheckInRepository;
  let sut: GetUserMetricsUseCase;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
  });

  it('should be able to get check-in count from user', async () => {
    await checkInRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1'
    });

    await checkInRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2'
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-1'
    });

    expect(checkInsCount).toEqual(2);
  });
});
