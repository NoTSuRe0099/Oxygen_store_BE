import express from 'express';
import {
  create,
  getAllProducts,
  update,
  deleteProduct,
  getSingleProduct,
} from '../controllers/ProductsController.js';
import { authorizeRoles, verifyToken } from '../middleware/JWTService.js';
const router = express.Router();

router
  .route('/')
  .get(verifyToken, getAllProducts)
  .post(verifyToken, authorizeRoles('admin'), create);

router
  .route('/:id')
  .put(verifyToken, authorizeRoles('admin'), update)
  .get(getSingleProduct)
  .delete(verifyToken, authorizeRoles('admin'), deleteProduct);

export default router;
