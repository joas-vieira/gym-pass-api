import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user.repository';
import { UserRepository } from '@/repositories/user.repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { RegisterUseCase } from './register';

describe('Register Use Case', () => {
  let userRepository: UserRepository;
  let sut: RegisterUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new RegisterUseCase(userRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const user = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBeTruthy();
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'john.doe@example.com';

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456'
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
