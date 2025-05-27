import dayjs from 'dayjs';
import { CheckIn, Prisma } from 'generated/prisma';
import { randomUUID } from 'node:crypto';
import { CheckInRepository } from '../check-in.repository';

export class InMemoryCheckInRepository implements CheckInRepository {
  private items: CheckIn[] = [];

  async findById(checkInId: string): Promise<CheckIn | null> {
    const checkIn = this.items.find((checkIn) => checkIn.id === checkInId);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findByIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfDay = dayjs(date).startOf('date');
    const endOfDay = dayjs(date).endOf('date');

    const checkIn = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isSameDate =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

      return checkIn.user_id === userId && isSameDate;
    });

    return checkIn || null;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((checkIn) => checkIn.user_id === userId).length;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date()
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
