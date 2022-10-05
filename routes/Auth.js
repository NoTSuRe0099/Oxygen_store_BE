const express = require('express');
const router = express.Router();
const {
  Register,
  Login,
  myProfile,
  Logout,
} = require('../controllers/AuthController');
const { verifyToken } = require('../middleware/JWTService');

router.route('/register').post(Register);

router.route('/login').post(Login);

router.route('/me').get(verifyToken, myProfile);

// router.route("/logout").get(Logout);

module.exports = router;
