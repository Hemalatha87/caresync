import express from 'express';
import { getAdminStats, getAllUsers, toggleDoctorVerification } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/doctors/:id/verify', toggleDoctorVerification);

export default router;
