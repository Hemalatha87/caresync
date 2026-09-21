import express from 'express';
import { getDoctors, getDoctorById, updateDoctorProfile } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctorProfile);

export default router;
