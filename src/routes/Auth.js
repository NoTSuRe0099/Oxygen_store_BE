import express from 'express';
import passport from 'passport';
import { FRONTEND_URL } from '../config/env.config.js';
import {
  Register,
  Login,
  myProfile,
  Logout,
} from '../controllers/AuthController.js';
import { isAuthenticated } from '../middleware/AuthMiddlewares.js';
import { asyncError } from '../middleware/errorMiddleware.js';
import { verifyToken } from '../middleware/JWTService.js';

const router = express.Router();

router.route('/register').post(Register);

router.route('/login').post(Login);

// router.route('/me').get(verifyToken, myProfile);

// router.route('/logout').delete(Logout);

router.get('/login/failed', (req, res) =>
  res.status(401).json({
    success: true,
    message: 'Login Failed',
  })
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/login/failed',
    successRedirect: 'http://localhost:3000',
  })
);

router.get('/me', isAuthenticated, (req, res) =>
  res.status(200).json({
    success: true,
    data: req?.user,
  })
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return req.session.destroy((errror) => {
      if (err) return next(errror);
      res.clearCookie('connect.sid');
      return res.status(200).json({
        success: true,
        message: 'Loged out.',
      });
    });
  });
});

// router.get('/logout', isAuthenticated, (req, res, next) => {
//   req.logout();
//   res.redirect(process.env.FRONTEND_URL);

//   req.session.destroy((err) => {
//     if (err) return next(err);
//     res.clearCookie('connect.sid', {
//       secure: process.env.NODE_ENV === 'development' ? false : true,
//       httpOnly: process.env.NODE_ENV === 'development' ? false : true,
//       sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
//     });
//     res.status(200).json({
//       success: true,
//       message: 'Loged out.',
//     });
//   });
// });

// router.route('/login').get((req, res, next) => {
//   res.send('LogedIN');
// });

export default router;
