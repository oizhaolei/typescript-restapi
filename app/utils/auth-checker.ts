import { Request } from 'express';
import { AuthChecker } from 'type-graphql';
import jwt from 'jsonwebtoken';

import { Context } from '../interfaces/context.interface';
import { User } from '../entities/User';

export const sign = (payload: User): string => {
  const { AUTH_SECRET } = process.env;
  return jwt.sign(payload, `${AUTH_SECRET}`);
};

export const verifyToken = async (req: Request): Promise<User> => {
  // Get the user token from the headers.
  const authorization = req.headers.authorization || '';

  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const { AUTH_SECRET } = process.env;
    try {
      const user = await jwt.verify(token, `${AUTH_SECRET}`);
      return Object.assign(new User(), user);
    } catch (e) {
      return User.anonymous;
    }
  }
  return User.anonymous;
};

// create auth checker function
export const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only if user exists
    return user !== undefined;
  }
  // there are some roles defined now

  if (!user) {
    // and if no user, restrict access
    return false;
  }
  if (user.roles.some(role => roles.includes(role.value))) {
    // grant access if the roles overlap
    return true;
  }

  // no roles matched, restrict access
  return false;
};
