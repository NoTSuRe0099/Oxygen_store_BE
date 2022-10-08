import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const user_Schema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Role is Required*'],
    default: 'user',
    enum: ['admin', 'user'],
  },
  username: {
    type: String,
    required: [true, 'Username is Required*'],
    minlength: [4, 'Username must be at least 4 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is Required*'],
    unique: [true, 'Email Already Exists'],
  },
  password: {
    type: String,
    required: [true, 'Password is Required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  avatar: {
    type: String,
    required: false,
  },

  address: {
    type: String,
    required: true,
    select: false,
  },
  city: {
    type: String,
    required: true,
    select: false,
  },

  state: {
    type: String,
    required: true,
    select: false,
  },

  country: {
    type: String,
    required: true,
    select: false,
  },
  pinCode: {
    type: Number,
    required: true,
    select: false,
  },
  phoneNo: {
    type: Number,
    required: true,
    select: false,
  },

  likedProducts: { required: false, type: [String] },
});

user_Schema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err);
  }
});

user_Schema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err);
  }
};

user_Schema.methods.generateToken = async function () {
  const id = this._id;
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
};

export default mongoose.model('User', user_Schema);
