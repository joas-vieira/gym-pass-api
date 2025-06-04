import { FastifyInstance } from 'fastify';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { register } from './register';
import { verifyJwt } from '@/middlewares/verify-jwt';
import { refresh } from './refresh';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  /* Authenticated routes */
  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
