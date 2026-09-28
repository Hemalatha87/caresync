import express from 'express';
import { getDoctors, getDoctorById, updateDoctorProfile, getSpecializationCounts } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/specialization-counts', getSpecializationCounts);
router.get('/:id', getDoctorById);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctorProfile);

export default router;
