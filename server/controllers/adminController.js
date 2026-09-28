import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// @desc    Get admin statistics overview
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
    const pendingDoctors = await Doctor.countDocuments({ isVerified: false });
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: { $in: ['completed', 'COMPLETED'] } });
    const cancelledAppointments = await Appointment.countDocuments({ status: { $in: ['cancelled', 'CANCELLED'] } });
    const pendingAppointments = await Appointment.countDocuments({ status: { $in: ['pending', 'PENDING'] } });
    const confirmedAppointments = await Appointment.countDocuments({ status: { $in: ['confirmed', 'CONFIRMED'] } });

    // Calculate revenue estimate from actual completed/confirmed appointments
    const revenueAppointments = await Appointment.find({
      status: { $in: ['completed', 'COMPLETED', 'confirmed', 'CONFIRMED'] }
    });
    const totalRevenue = revenueAppointments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalPatients,
        totalDoctors,
        verifiedDoctors,
        pendingDoctors,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        pendingAppointments,
        confirmedAppointments,
        totalRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list for admin with optional filtering
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const query = {};

    if (role && role !== 'All' && role !== 'all') {
      query.role = role.toLowerCase();
    }

    if (status && status !== 'All' && status !== 'all') {
      if (status.toLowerCase() === 'active') {
        query.$or = [{ status: 'active' }, { status: { $exists: false }, isActive: { $ne: false } }];
      } else if (status.toLowerCase() === 'inactive') {
        query.$or = [{ status: 'inactive' }, { isActive: false }];
      } else {
        query.status = status.toLowerCase();
      }
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        ...(query.$or || []),
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } },
        { address: { $regex: term, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle or set doctor verification status
// @route   PUT /api/admin/doctors/:id/verify, PATCH /api/admin/doctors/:id/verify
export const toggleDoctorVerification = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (req.body.isVerified !== undefined) {
      doctor.isVerified = Boolean(req.body.isVerified);
    } else {
      doctor.isVerified = !doctor.isVerified;
    }

    await doctor.save();

    return res.json({
      success: true,
      message: `Doctor verification status updated to ${doctor.isVerified ? 'Verified' : 'Pending Verification'}`,
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status (active, inactive, suspended)
// @route   PATCH /api/admin/users/:id/status, PUT /api/admin/users/:id/status
export const updateUserStatus = async (req, res) => {
  try {
    const { status, isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (status) {
      user.status = status;
      user.isActive = status === 'active';
    } else if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
      user.status = user.isActive ? 'active' : 'inactive';
    }

    await user.save();

    return res.json({
      success: true,
      message: `User status updated to ${user.status || (user.isActive ? 'active' : 'inactive')}`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If user is a doctor, remove doctor profile as well
    if (user.role === 'doctor') {
      await Doctor.deleteMany({ user: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'User account removed successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
