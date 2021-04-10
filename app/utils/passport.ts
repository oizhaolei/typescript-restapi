import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { jwtOptions } from '../utils/jwt';
import { UserModel } from '../entities/User';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtOptions.publicKey,
      algorithms: ['RS256'],
    },
    async (jwtPayload, done) => {
      try {
        // TODO: remove it
        if (Date.now() > jwtPayload.expires) return done('Token expired');

        const user = await UserModel.findOne({
          username: jwtPayload.username,
        }).exec();
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
