import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym.repository';
import { CreateGymUseCase } from '@/use-cases/create-gym';

export function makeCreateGymUseCase() {
  const gymRepository = new PrismaGymRepository();

  const useCase = new CreateGymUseCase(gymRepository);

  return useCase;
}
