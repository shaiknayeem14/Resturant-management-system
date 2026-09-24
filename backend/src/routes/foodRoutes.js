import express from 'express';
import {
  getCategories,
  createCategory,
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from '../controllers/foodController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/categories', protect, authorize('admin'), createCategory);

router.get('/', getFoodItems);
router.get('/:id', getFoodItemById);

router.post('/', protect, authorize('admin'), createFoodItem);
router.put('/:id', protect, authorize('admin'), updateFoodItem);
router.delete('/:id', protect, authorize('admin'), deleteFoodItem);

export default router;
