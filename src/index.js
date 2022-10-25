import cors from 'cors';
import express, { urlencoded } from 'express';
import * as cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import ConnectDB from './config/database.js';
import CategoryRoutes from './routes/categories.js';
import ProductsRoutes from './routes/products.js';
import Auth from './routes/Auth.js';
import CartRoutes from './routes/CartRoutes.js';

// ? ------> DotENV and google auth setup!
import './config/env.config.js';
import './utils/Provider.js';

//* configure express
const app = express();
// ? ------> Connect DB
ConnectDB();
app.use(morgan('dev'));

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://192.168.0.102:3000',
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
    },
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());

app.set('trust proxy', 1);

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// ? ------> Cludinary Global Config!
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ? ------> Routes Setup!

app.use('/api/v1/auth', Auth);
app.use('/api/v1/categories', CategoryRoutes);
app.use('/api/v1/products', ProductsRoutes);
app.use('/api/v1/cart', CartRoutes);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('<h1> Oxygen-Store-API </h1> ');
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port: 🚀 http://localhost:${process.env.PORT}`
  );
});
