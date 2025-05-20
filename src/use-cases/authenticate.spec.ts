import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user.repository';
import { UserRepository } from '@/repositories/user.repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

describe('Authenticate Use Case', () => {
  let userRepository: UserRepository;
  let sut: AuthenticateUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(userRepository);
  });

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6)
    });

    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6)
    });

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
