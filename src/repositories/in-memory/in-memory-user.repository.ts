import { Prisma, User } from 'generated/prisma';
import { UserRepository } from '../user.repository';

export class InMemoryUserRepository implements UserRepository {
  private items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-id',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date()
    };

    this.items.push(user);

    return user;
  }
}
