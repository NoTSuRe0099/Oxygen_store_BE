import express, { urlencoded } from 'express';
import './config/env.config.js';
import cors from 'cors';
import * as cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import CategoryRoutes from './routes/categories.js';
import ProductsRoutes from './routes/products.js';
import Auth from './routes/Auth.js';
import ConnectDB from './config/database.js';
import './utils/Provider.js';

//! configure dot env configure

//* configure express
const app = express();
app.use(express.json());
// app.use(
//   cookieSession({
//     name: 'session',
//     keys: ['cyberwolve'],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  }),
);

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,

//     cookie: {
//       secure: process.env.NODE_ENV === 'development' ? false : true,
//       httpOnly: process.env.NODE_ENV === 'development' ? false : true,
//       sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
//     },
//   })
// );

// app.use(
//   session({
//     secret: 'somethingsecretgoeshere',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );
// app.use(passport.authenticate('session'));

app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(
  fileUpload({
    useTempFiles: true,
  }),
);
// app.enable('trust proxy');

// connectPassport();

// ? ------> Connect DB
ConnectDB();

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

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('<h1> Oxygen-Store-API </h1> ');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
