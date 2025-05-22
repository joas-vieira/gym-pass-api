import { CheckInRepository } from '@/repositories/check-in.repository';
import { GymRepository } from '@/repositories/gym.repository';
import { CheckIn } from 'generated/prisma';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error';
import { MaxDistanceError } from './errors/max-distance.error';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private readonly checkInRepository: CheckInRepository,
    private readonly gymRepository: GymRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude
      },
      {
        latitude: Number(gym.latitude),
        longitude: Number(gym.longitude)
      }
    );

    const MAX_DISTANCE_IN_KM = 0.1;

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInRepository.findByIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId
    });

    return { checkIn };
  }
}
