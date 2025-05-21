import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in.repository';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym.repository';
import { Decimal } from '@prisma/client/runtime/library';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInUseCase } from './check-in';

describe('Check In Use Case', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let gymRepository: InMemoryGymRepository;
  let sut: CheckInUseCase;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInUseCase(checkInRepository, gymRepository);

    gymRepository.items.push({
      id: 'gym-1',
      name: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: Decimal(0),
      longitude: Decimal(0)
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: 0,
        userLongitude: 0
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    });

    vi.setSystemTime(new Date(2023, 0, 2, 12, 0, 0));

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymRepository.items.push({
      id: 'gym-2',
      name: 'Node Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.37845177959174),
      longitude: new Decimal(-53.289041136312946)
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-2',
        userLatitude: -23.37706193512421,
        userLongitude: -53.301014876883755
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in on nearby gym', async () => {
    gymRepository.items.push({
      id: 'gym-3',
      name: 'Node Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.37845177959174),
      longitude: new Decimal(-53.289041136312946)
    });

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-3',
      userLatitude: -23.378547820212145,
      userLongitude: -53.28863033169004
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
