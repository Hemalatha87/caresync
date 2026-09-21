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
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience required'],
    min: 0,
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee required'],
    min: 0,
  },
  clinic: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
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
        type: String, // e.g. "Monday", "Tuesday", "Wednesday", etc.
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      slots: [{ type: String }], // e.g. ["09:00 AM", "10:30 AM", "02:00 PM"]
    }
  ],
  isVerified: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
