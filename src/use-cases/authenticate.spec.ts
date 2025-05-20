import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user.repository';
import { hash } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(userRepository);

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
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(userRepository);

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(userRepository);

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
