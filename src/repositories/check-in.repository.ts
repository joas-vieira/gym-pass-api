import { CheckIn, Prisma } from 'generated/prisma';

export interface CheckInRepository {
  findById(checkInId: string): Promise<CheckIn | null>;
  findByIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  countByUserId(userId: string): Promise<number>;
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
}
