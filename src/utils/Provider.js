import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import UserSchema from '../models/UserSchema.js';

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '917868591634-v8lmpchiuhccm9v7cdbolcaevk7u5bun.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/api/v1/auth/google/callback',
      scope: ['profile', 'email'],
    },
    (async (accessToken, refreshToken, profile, done) => {
      const user = await UserSchema.findOne({
        googleId: profile.id,
      });
      // console.log('profile ===>', profile);
      if (!user) {
        const newUser = await UserSchema.create({
          googleId: profile.id,
          name: profile.displayName,
          photo: profile.photos[0].value,
          email: profile.emails[0].value,
        });

        return done(null, newUser);
      }
      return done(null, user);
    }),
  ),
);

passport.serializeUser((user, done) => {
  // console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  // console.log('deserializeUser', user);

  done(null, user);
});
