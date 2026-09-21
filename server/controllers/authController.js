import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'caresync_super_secret_jwt_key_2026_production', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Patient/Doctor)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role || 'patient',
    });

    // If registered as doctor, create a base Doctor document
    if (user.role === 'doctor') {
      await Doctor.create({
        user: user._id,
        name: user.name,
        specialization: req.body.specialization || 'General Physician',
        qualification: req.body.qualification || 'MBBS',
        experience: req.body.experience || 3,
        consultationFee: req.body.consultationFee || 500,
        clinic: {
          name: req.body.clinicName || 'CareSync Health Clinic',
          address: req.body.clinicAddress || '123 Medical Hub Ave',
          city: req.body.city || 'Metro Health City',
        },
        bio: 'Dedicated healthcare professional committing to excellence in patient care.',
        availability: [
          { day: 'Monday', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] },
          { day: 'Wednesday', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] },
          { day: 'Friday', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] }
        ]
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        address: user.address,
        doctorProfile: doctorProfile,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
