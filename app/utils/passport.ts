import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';

import { jwtOptions } from '../utils/jwt';
import { UserModel } from '../entities/User';

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
      if (!user) {
        return done(undefined, false, { message: `email ${email} not found.` });
      }
      const isMatch: boolean = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: 'Invalid email or password.' });
    } catch (error) {
      return done(error);
    }
  }),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtOptions.publicKey,
      algorithms: ['RS512'],
      issuer: jwtOptions.issuer,
      audience: jwtOptions.audience,
  },
    async (jwtPayload, done) => {
      try {
        // TODO: remove it
        if (Date.now() > jwtPayload.expires) return done('Token expired');

        const user = await UserModel.findById(jwtPayload._id);
        return done(undefined, user, jwtPayload);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
