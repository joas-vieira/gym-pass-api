import { makeFetchUserCheckInsHistoryUseCase } from '@/factories/make-fetch-user-check-ins-history-use-case.factory';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().min(1)
  });

  const { page } = querySchema.parse(request.query);

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page
  });

  return reply.status(200).send({
    checkIns
  });
}
