import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user.repository';
import { UserRepository } from '@/repositories/user.repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { GetUserProfileUseCase } from './get-user-profile';

describe('Get User Profile Use Case', () => {
  let userRepository: UserRepository;
  let sut: GetUserProfileUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetUserProfileUseCase(userRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6)
    });

    const { user } = await sut.execute({
      userId: createdUser.id
    });

    expect(user.id).toEqual(createdUser.id);
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
