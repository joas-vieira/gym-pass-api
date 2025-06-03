import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Check-in Metrics (e2e)', () => {
  beforeAll(async () => await app.ready());

  afterAll(async () => await app.close());

  it('should be able to get the check-in metrics', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'JavaScript Gym',
        description: null,
        phone: null,
        latitude: -23.5505,
        longitude: -46.6333
      });

    const gym = await prisma.gym.findFirstOrThrow();

    await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.5505,
        longitude: -46.6333
      })
      .expect(201);

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkInsCount).toEqual(1);
  });
});
