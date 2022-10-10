import express from 'express';
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProduct,
} from '../controllers/ProductsController.js';
import { authorizeRoles, verifyToken } from '../middleware/JWTService.js';

const router = express.Router();

router
  .route('/')
  .get(verifyToken, getAllProducts)
  .post(verifyToken, authorizeRoles('admin'), createProduct);

router
  .route('/:id')
  .put(verifyToken, authorizeRoles('admin'), updateProduct)
  .get(getSingleProduct)
  .delete(verifyToken, authorizeRoles('admin'), deleteProduct);

export default router;
