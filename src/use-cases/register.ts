import { UserRepository } from '@/repositories/user.repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

interface RegisterUseCaseProps {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUseCaseProps) {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    await this.userRepository.create({
      name,
      email,
      password_hash
    });
  }
}
