import { Prisma, User } from 'generated/prisma';
import { randomUUID } from 'node:crypto';
import { UserRepository } from '../user.repository';

export class InMemoryUserRepository implements UserRepository {
  private items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date()
    };

    this.items.push(user);

    return user;
  }
}
