import express from 'express';
import {
  create,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  update,
} from '../controllers/CategoryController.js';
import {
  authorizeRoles,
  isAuthenticated,
} from '../middleware/AuthMiddlewares.js';

const router = express.Router();

router.route('/').get(getAllCategories).post(create);
router
  .route('/:id')
  .put(update)
  .get(getSingleCategory)
  .delete(isAuthenticated, authorizeRoles('admin'), deleteCategory);

export default router;
