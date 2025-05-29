import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in.repository';
import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/fetch-user-check-ins-history';

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInRepository();

  const useCase = new FetchUserCheckInsHistoryUseCase(checkInRepository);

  return useCase;
}
