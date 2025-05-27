import { GymRepository } from '@/repositories/gym.repository';
import { Gym } from 'generated/prisma';

interface SearchGymsUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private readonly gymRepository: GymRepository) {}

  async execute({
    query,
    page
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymRepository.searchMany(query, page);

    return { gyms };
  }
}
