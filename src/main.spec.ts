import request from 'supertest';
import { app } from 'src/main';
import { before, after } from '@config/jest';

describe('HEALTH CHECK', () => {
  beforeAll(async () => {
    await before();
  });
  afterAll(async () => {
    await after();
  });
  it('API SHOULD BE UP AND RUNNING', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('API IS WORKING');
  }, 15000);
});
