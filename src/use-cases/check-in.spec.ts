import { CheckInRepository } from '@/repositories/check-in.repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CheckInUseCase } from './check-in';

describe('Check In Use Case', () => {
  let checkInRepository: CheckInRepository;
  let sut: CheckInUseCase;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository);
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1'
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
