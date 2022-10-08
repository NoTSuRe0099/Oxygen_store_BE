import express from 'express';
const router = express.Router();
import {
  Register,
  Login,
  myProfile,
  Logout,
} from '../controllers/AuthController.js';
import { verifyToken } from '../middleware/JWTService.js';

router.route('/register').post(Register);

router.route('/login').post(Login);

router.route('/me').get(verifyToken, myProfile);

router.route('/logout').delete(Logout);

export default router;
