import { makeGetUserProfileUseCase } from '@/factories/make-get-user-profile-use-case.factory';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileUseCase = makeGetUserProfileUseCase();

  const { user } = await getUserProfileUseCase.execute({
    userId: request.user.sub
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined
    }
  });
}
