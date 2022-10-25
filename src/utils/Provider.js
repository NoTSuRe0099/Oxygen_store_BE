import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import UserSchema from '../models/UserSchema.js';
import { createCart } from '../controllers/CartController.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserSchema.findOne({
        googleId: profile.id,
      });
      // console.log('profile ===>', profile);
      // console.log('useruseruser ===>', user);
      if (!user) {
        const newUser = await UserSchema.create({
          googleId: profile?.id,
          username: profile?.displayName,
          avatar: profile?.photos[0]?.value,
          email: profile?.emails[0]?.value,
        });
        await createCart(newUser?._id);
        return done(null, newUser);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user?.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserSchema.findOne({ _id: id }).catch((err) => {
    console.log('deserializeUser err ===>', err);
    done(err, null);
  });

  if (user) {
    done(null, user);
  }
});
