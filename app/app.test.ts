import request from 'supertest';
import App from './app';

describe('Test the root path', async () => {
  const { app, server } = await App();

  test('GET: /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toEqual('Hello World!');
  });

  test(`GET: ${server.graphqlPath}`, async () => {
    const response = await request(app).get(server.graphqlPath);
    expect(response.status).toBe(200);
    expect(response.text).toEqual('text');
  });
});
