import { makeFetchNearbyGymsUseCase } from '@/factories/make-fetch-nearby-gyms-use-case.factory';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number()
  });

  const { latitude, longitude } = querySchema.parse(request.query);

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude
  });

  return reply.status(201).send({
    gyms
  });
}
