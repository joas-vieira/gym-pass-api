import { ROLE } from '@/contracts/role';
import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { role: ROLE };
    user: {
      sub: string;
      role: ROLE;
    };
  }
}
