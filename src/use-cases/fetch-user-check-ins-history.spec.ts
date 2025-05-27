import { CheckInRepository } from '@/repositories/check-in.repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';

describe('Fetch User Check-Ins History Use Case', () => {
  let checkInRepository: CheckInRepository;
  let sut: FetchUserCheckInsHistoryUseCase;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
  });

  it('should be able to fetch user check-ins history', async () => {
    await checkInRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1'
    });

    await checkInRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2'
    });

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 1
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gym_id: 'gym-1' }),
        expect.objectContaining({ gym_id: 'gym-2' })
      ])
    );
  });

  it('should be able to fetch paginated user check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id: 'user-1',
        gym_id: `gym-${i}`
      });
    }

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 2
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gym_id: 'gym-21' }),
        expect.objectContaining({ gym_id: 'gym-22' })
      ])
    );
  });
});
