import express from 'express';
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from '../controllers/tableController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTables);
router.get('/:id', getTableById);

router.post('/', protect, authorize('admin'), createTable);
router.put('/:id', protect, authorize('admin'), updateTable);
router.delete('/:id', protect, authorize('admin'), deleteTable);

export default router;
