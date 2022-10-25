import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
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
  googleId: {
    type: String,
    unique: true,
    required: false,
  },
  email: {
    type: String,
    required: [true, 'Email is Required*'],
    unique: [true, 'Email Already Exists'],
  },
  password: {
    type: String,
    required: [false, 'Password is Required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  avatar: {
    type: String,
    required: false,
  },

  address: {
    type: String,
    required: false,
    select: false,
  },
  city: {
    type: String,
    required: false,
    select: false,
  },

  state: {
    type: String,
    required: false,
    select: false,
  },

  country: {
    type: String,
    required: false,
    select: false,
  },
  pinCode: {
    type: Number,
    required: false,
    select: false,
  },
  phoneNo: {
    type: Number,
    required: false,
    select: false,
  },

  likedProducts: { required: false, type: [String] },
});

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw Error(err);
  }
};

userSchema.methods.generateToken = async function () {
  // eslint-disable-next-line no-underscore-dangle
  const id = this._id;
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
};

export default mongoose.model('User', userSchema);
