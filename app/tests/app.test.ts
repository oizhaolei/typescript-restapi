import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import supertest from 'supertest';
import App from '../app';
import IndexRoute from '../routes/index.route';
import { CategoryResolver } from '../resolvers/Category';

describe('normal', () => {
  let app: express.Express;
  beforeAll(async () => {
    // console.log("1 - beforeAll");
    app = await App([new IndexRoute()], [CategoryResolver]);
  });
  afterAll(async () => {
    // console.log("1 - afterAll");
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

  test('GET: /graphql', async done => {
    const request = supertest(app);
    const query = `
    query returnAllCategories {
      returnAllCategories {
        id
        name
        description
      }
    }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.returnAllCategories.length).toBeGreaterThanOrEqual(0);
    done();
  });
});
