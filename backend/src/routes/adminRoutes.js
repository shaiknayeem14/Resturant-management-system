import express from 'express';
import {
  getAdminAnalytics,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
