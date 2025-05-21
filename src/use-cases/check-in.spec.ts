import { CheckInRepository } from '@/repositories/check-in.repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in.repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInUseCase } from './check-in';

describe('Check In Use Case', () => {
  let checkInRepository: CheckInRepository;
  let sut: CheckInUseCase;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1'
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1'
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1'
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1'
    });

    vi.setSystemTime(new Date(2023, 0, 2, 12, 0, 0));

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1'
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
