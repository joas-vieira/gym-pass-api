import { CheckInRepository } from '@/repositories/check-in.repository';
import { CheckIn } from 'generated/prisma';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private readonly checkInRepository: CheckInRepository) {}

  async execute({
    userId,
    gymId
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDate = await this.checkInRepository.findByIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate) {
      throw new Error();
    }

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId
    });

    return { checkIn };
  }
}
