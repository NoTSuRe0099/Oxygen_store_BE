import express from 'express';
import {
  addSingleProduct,
  getUserCart,
} from '../controllers/CartController.js';
import { isAuthenticated } from '../middleware/AuthMiddlewares.js';

const router = express.Router();

router.get('/', isAuthenticated, getUserCart);
router.get('/addSingleProduct/:product_id', isAuthenticated, addSingleProduct);

export default router;
