import { sign, verifyToken } from '../utils/auth-checker';
import { User } from '../entities/User';

describe('jwt', () => {
  test('normal', async () => {
    const user = {
      id: 'id',
      username: 'username',
      password: 'password',
      email: 'email',
      roles: ['ADMIN'],
    };

    const token: string = sign(user);
    const newUser: User = await verifyToken(`Bearer ${token}`);

    expect(newUser.email).toEqual(user.email);
    expect(newUser.username).toEqual(user.username);
  });
});
