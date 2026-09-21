import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    index: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true,
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
    index: true,
  },
  timeSlot: {
    type: String, // e.g. "10:30 AM"
    required: true,
  },
  consultationType: {
    type: String,
    enum: ['In-Clinic', 'Video Consultation'],
    default: 'In-Clinic',
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
    default: 'CONFIRMED',
    set: (v) => (typeof v === 'string' ? v.toUpperCase() : v),
    index: true,
  },
  reason: {
    type: String,
    default: 'General Consultation',
  },
  notes: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid',
  }
}, { timestamps: true });

// Auto generate booking ID if not supplied
appointmentSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const dateStr = (this.date || new Date().toISOString().split('T')[0]).replace(/-/g, '');
    const randDigits = Math.floor(10000 + Math.random() * 90000);
    this.bookingId = `CS-${dateStr}-${randDigits}`;
  }
  if (!this.fee) {
    this.fee = this.amount;
  }
  if (typeof this.status === 'string') {
    this.status = this.status.toUpperCase();
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
