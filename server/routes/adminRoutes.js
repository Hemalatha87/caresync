import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  toggleDoctorVerification,
  updateUserStatus,
  deleteUser
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/doctors/:id/verify', toggleDoctorVerification);
router.patch('/doctors/:id/verify', toggleDoctorVerification);
router.patch('/users/:id/status', updateUserStatus);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

export default router;
