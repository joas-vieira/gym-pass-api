import { UserRepository } from '@/repositories/user.repository';
import { hash } from 'bcryptjs';
import { User } from 'generated/prisma';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.userRepository.create({
      name,
      email,
      password_hash
    });

    return { user };
  }
}
