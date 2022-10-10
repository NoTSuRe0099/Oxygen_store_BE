import Cloudinary from 'cloudinary';
import User from '../models/UserSchema.js';
import { asyncError } from '../middleware/errorMiddleware.js';

const cloudinary = Cloudinary.v2;

//* Register User
export const Register = asyncError(async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      address,
      city,
      state,
      country,
      pinCode,
      phoneNo,
    } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(401)
        .json({ success: false, message: 'Email already registered' });
    }

    if (!req?.files?.avatar) {
      return res.status(400).json({
        success: false,
        messasge: 'Please provide image in avatar*',
      });
    }

    let avatar = await req?.files?.avatar;

    await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: 'Oxygen-store/users',
      },
      (err, result) => {
        avatar = result?.secure_url;
      }
    );

    const newUser = new User({
      username,
      email,
      password,
      avatar,
      address,
      city,
      state,
      country,
      pinCode,
      phoneNo,
    });
    user = await User.create(newUser).catch((error) => {
      console.log('error', error);
      res.json({
        success: false,
        message: error?.message,
      });
    });

    const token = await user?.generateToken();
    const options = {
      expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
      httpOnly: true,
    };
    return res.status(201).cookie('token', token, options).json({
      success: true,
      message: 'Registered successfully ✅',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

//* Login User
export const Login = asyncError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.json({
      status: 'error',
      message: 'Email not found',
    });
  }
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Password is incorrect',
    });
  }
  const token = await user.generateToken();
  const options = {
    expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
    httpOnly: true,
  };
  return res.status(200).cookie('token', token, options).json({
    success: true,
    message: 'Logged in successfully',
  });
});

//* Get User Profile
export const myProfile = asyncError(async (req, res) => {
  try {
    const { id } = req;
    const user = await User.findById(id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

//* Logout User
export const Logout = asyncError(async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});
