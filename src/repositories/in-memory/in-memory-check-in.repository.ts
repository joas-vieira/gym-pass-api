import dayjs from 'dayjs';
import { CheckIn, Prisma } from 'generated/prisma';
import { randomUUID } from 'node:crypto';
import { CheckInRepository } from '../check-in.repository';

export class InMemoryCheckInRepository implements CheckInRepository {
  private items: CheckIn[] = [];

  findByIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfDay = dayjs(date).startOf('date');
    const endOfDay = dayjs(date).endOf('date');

    const checkIn = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isSameDate =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

      return checkIn.user_id === userId && isSameDate;
    });

    return Promise.resolve(checkIn || null);
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
}
