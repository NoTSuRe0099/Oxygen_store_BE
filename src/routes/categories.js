import express from 'express';
import {
  create,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  update,
} from '../controllers/CategoryController.js';
import { authorizeRoles, verifyToken } from '../middleware/JWTService.js';

const router = express.Router();

router
  .route('/')
  .get(getAllCategories)
  .post(verifyToken, authorizeRoles('admin'), create);
router
  .route('/:id')
  .put(verifyToken, authorizeRoles('admin'), update)
  .get(getSingleCategory)
  .delete(verifyToken, authorizeRoles('admin'), deleteCategory);

export default router;
