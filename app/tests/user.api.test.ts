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
    app = await App([usersRoute]);
  });
  afterAll(async () => {
    // console.log("1 - afterAll");

    mongoose.disconnect();
  });

  it('response All Users', async () => {
    const request = supertest(app);
    {
      const response = await request.get(`${usersRoute.path}`);
      expect(response.status).toBe(200);
    }
    let userId;
    {
      const response = await request
        .post(`${usersRoute.path}`)
        .send({
          username: 'john2',
          password: 'john2',
          email: 'johnx@gmail.com',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      expect(response.status).toBe(201);
      console.log('create user:', response.body.data);
      userId = response.body.data._id;
    }
    {
      const response = await request.delete(`${usersRoute.path}/${userId}`).set('Accept', 'application/json').expect('Content-Type', /json/);
      expect(response.status).toBe(200);
      console.log('delete user:', response.body.data);
      userId = response.body.data._id;
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
