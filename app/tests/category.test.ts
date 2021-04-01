import 'dotenv/config';
import express from 'express';
import supertest from 'supertest';
import App from '../app';
import { CategoryResolver } from '../resolvers/Category';

describe('Category', () => {
  let app: express.Express;
  beforeAll(async () => {
    // console.log("1 - beforeAll");
    app = await App([], [CategoryResolver]);
  });

  test('crud', async () => {
    const request = supertest(app);
    // r
    {
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
      expect(response.body.data.returnAllCategories.length).toBe(0);
    }
    // c
    let categoryId;
    {
      const query = `
      mutation createCategory {
        createCategory(data: {
          name: "woman",
          description: "for woman"
        }) {
          id
          name
          description
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.createCategory.name).toBe('woman');
    }
    {
      const query = `
      query returnSingleCategory {
        returnSingleCategory(id: ${categoryId}) {
          id
          name
          description
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.createCategory.name).toBe('woman');
    }
    {
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
      expect(response.body.data.returnAllCategories.length).toBe(1);
    }
    // u
    // d
    {
      const query = `
      mutation deleteCategory {
        deleteCategory(id: ${categoryId})
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.deleteCategory).toBeTruthy();
    }
    // r
    {
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
      expect(response.body.data.returnAllCategories.length).toBe(0);
    }
  });
});
