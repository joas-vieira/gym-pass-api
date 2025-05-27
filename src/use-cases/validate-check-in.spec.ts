import { CheckInRepository } from '@/repositories/check-in.repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

describe('Validate Check In Use Case', () => {
  let checkInRepository: CheckInRepository;
  let sut: ValidateCheckInUseCase;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    // vi.useFakeTimers();
  });

  // afterEach(() => {
  //   vi.useRealTimers();
  // });

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
});
