import jwt from 'jsonwebtoken';
import UserModel from '../models/UserSchema.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Un-Authorized' });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await UserModel.findById(user?.id).catch((err) => {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    });

    console.log('req.user', req.user);

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role: ${req.user.role} is not allowed to access this resouce `,
      });
    }

    next();
  };
};
