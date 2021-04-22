import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import supertest from 'supertest';
import App from '../app';
import UsersRoute from '../routes/users.route';
import log4js from '../utils/logger';

const logger = log4js('tests/user.api.test');

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  let app: express.Express;
  const usersRoute = new UsersRoute();

  beforeAll(async () => {
    jest.setTimeout(300000);
    app = await App([usersRoute]);
  });
  afterAll(async () => {
    mongoose.disconnect();
  });

  it('response All Users', async () => {
    const request = supertest(app);
    {
      const response = await request.get(`${usersRoute.path}`);
      expect(response.status).toBe(200);
    }
    // delete all
    {
      const response = await request.delete(`${usersRoute.path}/all`).set('Accept', 'application/json').expect('Content-Type', /json/);
      logger.debug('deletedCount:', response.body.deletedCount);
      expect(response.status).toBe(200);
      expect(response.body.deletedCount).toBeGreaterThanOrEqual(0);
    }
    // create one
    let userId;
    {
      const response = await request
        .post(`${usersRoute.path}`)
        .send({
          username: 'john2',
          password: 'john2',
          email: 'johnx1@gmail.com',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      logger.debug('create user:', response.body.data);
      expect(response.status).toBe(201);
      userId = response.body.data._id;
    }
    // get one
    {
      const response = await request.get(`${usersRoute.path}/${userId}`).set('Accept', 'application/json').expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(userId);
    }
    // get one
    {
      const response = await request
        .get(`${usersRoute.path}/6080d1b75f96183eb0ee6b2d`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      logger.debug('response.body:', response.body);

      expect(response.status).toBe(409);
    }
  });

  it('login', async () => {
    const request = supertest(app);
    //register
    let userId;
    {
      const response = await request
        .post('/register')
        .send({
          username: 'john2',
          password: 'john2',
          email: 'johnx2@gmail.com',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      logger.debug('response.body:', response.body);
      expect(response.status).toBe(201);
      expect(response.body.token).not.toBeNull();
      userId = response.body.user._id;
    }
    //login
    let token;
    {
      const response = await request
        .post('/login')
        .send({
          email: 'johnx2@gmail.com',
          password: 'john2',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      logger.debug('response.body:', response.body);
      expect(response.status).toBe(200);
      token = response.body.token;
    }
    //profile
    {
      const response = await request
        .get('/profile')
        .set('Accept', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .expect('Content-Type', /json/);
      logger.debug('response.body:', response.body);

      expect(response.status).toBe(200);
      expect(response.body.user._id).toBe(userId);
    }
  });

  it('mock', () => {
    const usersRoute = new UsersRoute();
    usersRoute.usersController.userService.userModel.find = jest.fn().mockReturnValue(
      Promise.resolve([
        {
          email: 'example@gmail.com',
          password: 'q1w2e3r4!',
        },
      ]),
    );

    mongoose.connect = jest.fn();
    const request = supertest(app);
    return request.get(`${usersRoute.path}`).expect(200);
  });
});
