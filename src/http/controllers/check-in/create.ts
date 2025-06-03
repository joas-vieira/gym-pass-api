import { makeCheckInUseCase } from '@/factories/make-check-in-use-case.factory';
import { MaxDistanceError } from '@/use-cases/errors/max-distance.error';
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins.error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found.error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    gymId: z.string().uuid()
  });

  const bodySchema = z.object({
    latitude: z.number(),
    longitude: z.number()
  });

  const { gymId } = paramsSchema.parse(request.params);
  const { latitude, longitude } = bodySchema.parse(request.body);

  try {
    const checkInUseCase = makeCheckInUseCase();

    const { checkIn } = await checkInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude
    });

    return reply.status(201).send({
      checkIn
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof MaxDistanceError) {
      return reply.status(400).send({ message: error.message });
    }
    if (error instanceof MaxNumberOfCheckInsError) {
      return reply.status(403).send({ message: error.message });
    }

    throw error;
  }
}
