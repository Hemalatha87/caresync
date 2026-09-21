import express from 'express';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.put('/:id/status', updateAppointmentStatus);
router.delete('/:id', cancelAppointment);

export default router;
