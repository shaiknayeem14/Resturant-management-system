import express from 'express';
import {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
} from '../controllers/reservationController.js';
import { protect, authorize, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createReservation);
router.get('/my-reservations', protect, getMyReservations);
router.put('/:id/cancel', protect, cancelReservation);

// Admin routes
router.get('/', protect, authorize('admin'), getAllReservations);
router.put('/:id/status', protect, authorize('admin'), updateReservationStatus);

export default router;
