import { CheckInRepository } from '@/repositories/check-in.repository';
import { CheckIn } from 'generated/prisma';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import dayjs from 'dayjs';
import { LateCheckInError } from './errors/late-check-in.error';

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private readonly checkInRepository: CheckInRepository) {}

  async execute({
    checkInId
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      dayjs(checkIn.created_at),
      'minute'
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInError();
    }

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);

    return { checkIn };
  }
}
