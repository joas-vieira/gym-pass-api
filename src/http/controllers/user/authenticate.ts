import { makeAuthenticateUseCase } from '@/factories/make-authenticate-use-case.factory';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });

  const { email, password } = bodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password
    });

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '10m' } }
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } }
    );

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: true
      })
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
