import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import supertest from 'supertest';
import App from '../app';
import UsersRoute from '../routes/users.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  let app: express.Express;
  const usersRoute = new UsersRoute();

  beforeAll(async () => {
    // console.log("1 - beforeAll");
    app = await App([usersRoute], []);
  });
  afterAll(async () => {
    // console.log("1 - afterAll");

    mongoose.disconnect();
  });

  it('response All Users', async () => {
    const request = supertest(app);
    const response = await request.get(`${usersRoute.path}`);
    expect(response.status).toBe(200);
  });
});
