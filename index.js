const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const ConnectDB = require('./config/database');
const Auth = require('./routes/Auth');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

//! configure dot env configure
dotenv.config({ path: path.join(__dirname, './config/config.env') });

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
app.use(cors());

//? ------> Cludinary Global Config!
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//? ------> Routes Setup!
app.use('/api/v1/auth', Auth);

//? ------> Connect DB
ConnectDB();

app.get('/', (req, res) => {
  res.send('<h1> Hello World! </h1> ');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
