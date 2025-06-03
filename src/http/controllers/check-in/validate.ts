import { makeValidateCheckInUseCase } from '@/factories/make-validate-check-in-use-case.factory';
import { LateCheckInError } from '@/use-cases/errors/late-check-in.error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found.error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    checkInId: z.string().uuid()
  });

  const { checkInId } = paramsSchema.parse(request.params);

  try {
    const validateCheckInUseCase = makeValidateCheckInUseCase();

    await validateCheckInUseCase.execute({
      checkInId
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof LateCheckInError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
