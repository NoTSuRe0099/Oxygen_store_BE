import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import ConnectDB from './config/database.js';
import Auth from './routes/Auth.js';
import cors from 'cors';
import * as cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import CategoryRoutes from './routes/categories.js';
import ProductsRoutes from './routes/products.js';

//! configure dot env configure
dotenv.config({ path: './src/config/config.env' });

//* configure express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(
  cors({
    origin: '*',
  })
);

//? ------> Cludinary Global Config!
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//? ------> Routes Setup!
app.use('/api/v1/auth', Auth);
app.use('/api/v1/categories', CategoryRoutes);
app.use('/api/v1/products', ProductsRoutes);

//? ------> Connect DB
ConnectDB();

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('<h1> Oxygen-Store-API </h1> ');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
