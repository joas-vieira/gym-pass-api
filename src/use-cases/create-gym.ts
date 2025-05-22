import { GymRepository } from '@/repositories/gym.repository';
import { Gym } from 'generated/prisma';

interface CreateGymUseCaseRequest {
  name: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private readonly gymRepository: GymRepository) {}

  async execute({
    name,
    description,
    phone,
    latitude,
    longitude
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude
    });

    return { gym };
  }
}
