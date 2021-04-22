import jwt from 'jsonwebtoken';

import { jwtOptions } from '../utils/jwt';
import { User } from '../entities/User';

export const sign = (payload: Record<string, unknown>, opts?: Partial<jwt.SignOptions>): string => {
  const defaultSignOptions: Partial<jwt.SignOptions> = {
    algorithm: 'RS512',
    issuer: jwtOptions.issuer,
    audience: jwtOptions.audience,
    expiresIn: jwtOptions.expiresIn,
  };

  return jwt.sign(payload, jwtOptions.privateKey, {
    ...defaultSignOptions,
    ...opts,
  });
};

export const verifyToken = async (authorization: string, opts?: Partial<jwt.VerifyOptions>): Promise<User> => {
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    try {
      const defaultVerifyOptions: Partial<jwt.VerifyOptions> = {
        algorithms: ['RS512'],
        issuer: jwtOptions.issuer,
        audience: jwtOptions.audience,
      };

      const userDoc: any = await jwt.verify(token, jwtOptions.publicKey, {
        ...defaultVerifyOptions,
        ...opts,
      });

      return Object.assign(new User(), {
        ...userDoc,
        id: userDoc._id,
      });
    } catch (e) {
      return User.anonymous;
    }
  }
  return User.anonymous;
};
