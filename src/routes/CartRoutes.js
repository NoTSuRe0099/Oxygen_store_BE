import express from 'express';
import {
  decrementProductQty,
  getUserCart,
  incrementProductQty,
  removeProduct,
} from '../controllers/CartController.js';
import { isAuthenticated } from '../middleware/AuthMiddlewares.js';

const router = express.Router();

router.get('/', isAuthenticated, getUserCart);
router.get(
  '/incrementProductQty/:product_id',
  isAuthenticated,
  incrementProductQty
);
router.get(
  '/decrementProductQty/:product_id',
  isAuthenticated,
  decrementProductQty
);
router.get('/removeProduct/:product_id', isAuthenticated, removeProduct);

export default router;
