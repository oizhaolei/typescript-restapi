import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import supertest from 'supertest';
import App from '../app';
import { CategoryResolver } from '../resolvers/Category';
import { ProductResolver } from '../resolvers/Product';

describe('Product', () => {
  let app: express.Express;
  beforeAll(async () => {
    // console.log("1 - beforeAll");
    app = await App([], [CategoryResolver, ProductResolver]);
  });
  afterAll(async () => {
    // console.log("1 - afterAll");

    mongoose.disconnect();
  });

  test('crud', async () => {
    const request = supertest(app);
    // r
    let originLength;
    {
      const query = `
      query returnAllProducts {
        returnAllProducts {
          id
          name
          description
          color
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllProducts.length).toBeGreaterThanOrEqual(0);
      originLength = response.body.data.returnAllProducts.length;
    }
    // c
    let productId;
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
      categoryId = response.body.data.createCategory.id;
    }
    {
      const query = `
      mutation createProduct {
        createProduct(data: {
          name: "woman",
          description: "for woman"
          color: "red"
          stock: 11
          price: 12
          category: "${categoryId}"
        }) {
          id
          name
          description
          color
          stock
          price
          category {
            id
            name
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      productId = response.body.data.createProduct.id;
      expect(response.body.data.createProduct.name).toBe('woman');
    }
    {
      const query = `
      query returnSingleProduct {
        returnSingleProduct(id: "${productId}") {
          id
          name
          description
          color
          stock
          price
          category {
            id
            name
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnSingleProduct.name).toBe('woman');
    }
    {
      const query = `
      query returnAllProducts {
        returnAllProducts {
          id
          name
          description
          color
          stock
          price
       }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllProducts.length).toBe(originLength + 1);
    }
    // u
    // d
    {
      const query = `
      mutation deleteProduct {
        deleteProduct(id: "${productId}")
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.deleteProduct).toBeTruthy();
    }
    // d
    {
      const query = `
      mutation deleteProduct {
        deleteProduct(id: "${productId}")
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
    }
    // r
    {
      const query = `
      query returnAllProducts {
        returnAllProducts {
          id
          name
          description
          color
          stock
          price
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllProducts.length).toBe(originLength);
    }
    // da
    {
      const query = `
      mutation deleteAllProducts {
        deleteAllProducts
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.deleteAllProducts).toBeTruthy();
    }
    // r
    {
      const query = `
      query returnAllProducts {
        returnAllProducts {
          id
          name
          description
          color
          stock
          price
          category {
            id
            name
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllProducts.length).toBe(0);
    }
  });
});
