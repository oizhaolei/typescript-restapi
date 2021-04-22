import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import supertest from 'supertest';
import App from '../app';
import IndexRoute from '../routes/index.route';

describe('normal', () => {
  let app: express.Express;
  beforeAll(async () => {
    app = await App([new IndexRoute()]);
  });
  afterAll(async () => {
    mongoose.disconnect();
  });

  test('GET: /', async () => {
    const request = supertest(app);
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.body.msg).toEqual('Hello World!');
  });

  // test('GET: /api-docs', async () => {
  //   const request = supertest(app);
  //   const response = await request.get('/api-docs');
  //   expect(response.status).toBe(200);
  // });
});
