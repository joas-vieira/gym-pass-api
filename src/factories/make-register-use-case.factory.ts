import { PrismaUserRepository } from '@/repositories/prisma/prisma-user.repository';
import { RegisterUseCase } from '@/use-cases/register';

export function makeRegisterUseCase() {
  const userRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(userRepository);

  return registerUseCase;
}
