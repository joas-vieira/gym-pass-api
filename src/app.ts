import fastify from 'fastify';
import { routes } from './http/routes';
import { ZodError } from 'zod';
import { env } from './env';

export const app = fastify();

app.register(routes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format()
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here we should log to an external service
  }

  return reply.status(500).send({
    message: 'Internal server error'
  });
});
