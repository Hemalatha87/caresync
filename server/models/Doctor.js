import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    index: true,
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience required'],
    min: 0,
    index: true,
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee required'],
    min: 0,
    index: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Female',
    index: true,
  },
  consultationType: {
    type: String,
    enum: ['In-Clinic', 'Video Consultation', 'Both'],
    default: 'Both',
    index: true,
  },
  clinic: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
  },
  location: {
    type: String,
    default: '',
    index: true,
  },
  bio: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5,
    index: true,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  availability: [
    {
      day: {
        type: String, // e.g. "Monday", "Tuesday", etc.
      },
      date: {
        type: String, // e.g. "2026-09-25"
      },
      slots: [{ type: String }], // e.g. ["09:00 AM", "10:30 AM", "02:00 PM"]
    }
  ],
  nextAvailableSlot: {
    type: String,
    default: 'Today, 04:30 PM',
  },
  isVerified: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Compound text index for search
doctorSchema.index({
  name: 'text',
  specialization: 'text',
  'clinic.name': 'text',
  'clinic.city': 'text',
  location: 'text',
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
