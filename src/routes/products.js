import express from 'express';
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProduct,
} from '../controllers/ProductsController.js';
import {
  authorizeRoles,
  isAuthenticated,
} from '../middleware/AuthMiddlewares.js';

const router = express.Router();
// isAuthenticated,
//   authorizeRoles('admin'),
router.route('/').get(getAllProducts).post(createProduct);

router
  .route('/:id')
  .put(updateProduct)
  .get(getSingleProduct)
  .delete(deleteProduct);

export default router;
