import { verifyJwt } from '@/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { create } from './create';
import { search } from './search';
import { nearby } from './nearby';
import { verifyUserRole } from '@/middlewares/verify-user-role';

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create);
  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);
}
