import { verifyJwt } from '@/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { create } from './create';
import { history } from './history';
import { metrics } from './metrics';
import { validate } from './validate';
import { verifyUserRole } from '@/middlewares/verify-user-role';

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/gyms/:gymId/check-ins', create);
  app.get('/check-ins/metrics', metrics);
  app.get('/check-ins/history', history);
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate
  );
}
