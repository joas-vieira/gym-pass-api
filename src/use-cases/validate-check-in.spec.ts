import { CheckInRepository } from '@/repositories/check-in.repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in.repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LateCheckInError } from './errors/late-check-in.error';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { ValidateCheckInUseCase } from './validate-check-in';

describe('Validate Check In Use Case', () => {
  let checkInRepository: CheckInRepository;
  let sut: ValidateCheckInUseCase;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate a check in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    });

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check in', async () => {
    await expect(() =>
      sut.execute({ checkInId: 'inexistent-check-in-id' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate a check in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0));

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id })
    ).rejects.toBeInstanceOf(LateCheckInError);
  });
});
