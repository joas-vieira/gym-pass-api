import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym.repository';
import { SearchGymsUseCase } from '@/use-cases/search-gyms';

export function makeSearchGymsUseCase() {
  const gymRepository = new PrismaGymRepository();

  const useCase = new SearchGymsUseCase(gymRepository);

  return useCase;
}
