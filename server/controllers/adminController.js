import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// @desc    Get admin statistics overview
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });

    // Calculate revenue estimate
    const completedList = await Appointment.find({ status: 'completed' });
    const totalRevenue = completedList.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return res.json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
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

// @desc    Get all users list for admin
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle doctor verification status
// @route   PUT /api/admin/doctors/:id/verify
export const toggleDoctorVerification = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    doctor.isVerified = !doctor.isVerified;
    await doctor.save();

    return res.json({
      success: true,
      message: `Doctor verification status updated to ${doctor.isVerified ? 'Verified' : 'Unverified'}`,
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
