import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Check-in History (e2e)', () => {
  beforeAll(async () => await app.ready());

  afterAll(async () => await app.close());

  it('should be able to list check-in history', async () => {
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
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: '1'
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toHaveLength(1);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id
      })
    ]);
  });
});
