import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
  avatar: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'unspecified'],
    default: 'unspecified',
  },
  dob: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  bloodGroup: {
    type: String,
    default: '',
  },
  emergencyContact: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Match password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving & keep avatar / profileImage in sync
userSchema.pre('save', async function (next) {
  if (this.profileImage && !this.avatar) {
    this.avatar = this.profileImage;
  } else if (this.avatar && !this.profileImage) {
    this.profileImage = this.avatar;
  }

  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
