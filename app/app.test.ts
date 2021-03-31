import supertest from 'supertest';
import App from './app';

describe('Test the root path', () => {
  test('GET: /', async () => {
    const { app } = await App();

    const request = supertest(app);
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toEqual('Hello World!');
  });

  test('GET: graphqlPath', async () => {
    const { app, server } = await App();

    const request = supertest(app);
    const response = await request.post(server.graphqlPath).send({
      query: `query returnAllCategories {
  returnAllCategories {
    id
    name
    description
  }
}`,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.returnAllCategories.length).toBe(0);
  });
});
