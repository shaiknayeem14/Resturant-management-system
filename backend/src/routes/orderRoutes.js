import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect, authorize, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Admin only order operations
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
