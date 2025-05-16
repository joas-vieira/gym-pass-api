import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      findByEmail: async () => null,
      create: async (data) => ({
        id: 'user-id',
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
        created_at: new Date()
      })
    });

    const user = await registerUseCase.execute({
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
});
