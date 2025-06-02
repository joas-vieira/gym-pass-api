import { makeCreateGymUseCase } from '@/factories/make-create-gym-use-case.factory';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number(),
    longitude: z.number()
  });

  const { name, description, phone, latitude, longitude } = bodySchema.parse(
    request.body
  );

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.execute({
    name,
    description,
    phone,
    latitude,
    longitude
  });

  return reply.status(201).send();
}
