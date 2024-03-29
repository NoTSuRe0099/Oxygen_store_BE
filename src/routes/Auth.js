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
import sendMail from '../utils/sendMail.js';

const router = express.Router();

router.route('/register').post(Register);

router.route('/login').post(Login);

// router.route('/me').get(verifyToken, myProfile);

// router.route('/logout').delete(Logout);

router.get('/login/failed', (req, res) =>
  res.status(401).json({
    success: false,
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
    successRedirect: `${process.env.FRONTEND_URL}/googleLoginSuccess`,
  })
);

router.get('/me', isAuthenticated, (req, res) =>
  res.status(200).json({
    success: true,
    data: req?.user,
  })
);

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    res.clearCookie('connect.sid', {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
    });
    return res.status(200).json({
      success: true,
      message: 'Logged Out',
    });
  });
});

router.post('/sendMail', async (req, res) => {
  const { receiver, subject, message } = req.body;
  const info = await sendMail(receiver, subject, message);

  res.send({ info });
});

export default router;
