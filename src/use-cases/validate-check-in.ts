import { CheckInRepository } from '@/repositories/check-in.repository';
import { CheckIn } from 'generated/prisma';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

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

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);

    return { checkIn };
  }
}
