import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  timeSlot: {
    type: String, // e.g. "10:30 AM"
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed',
  },
  reason: {
    type: String,
    default: 'General Checkup',
  },
  notes: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid',
  }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
