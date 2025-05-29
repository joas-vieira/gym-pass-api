import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym.repository';
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms';

export function makeFetchNearbyGymsUseCase() {
  const gymRepository = new PrismaGymRepository();

  const useCase = new FetchNearbyGymsUseCase(gymRepository);

  return useCase;
}
