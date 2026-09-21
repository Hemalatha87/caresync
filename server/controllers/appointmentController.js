import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, patientName, patientEmail, patientPhone, reason, notes } = req.body;

    if (!doctorId || !date || !timeSlot || !patientName || !patientEmail || !patientPhone) {
      return res.status(400).json({ success: false, message: 'Please fill all required appointment fields' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Selected doctor was not found' });
    }

    // Check if slot already booked for this doctor on date & time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked for the selected date. Please choose another slot.',
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      patientName,
      patientEmail,
      patientPhone,
      date,
      timeSlot,
      reason: reason || 'General Consultation',
      notes: notes || '',
      amount: doctor.consultationFee,
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Appointment successfully booked!',
      appointment: populatedAppointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's appointments (Patient / Doctor / Admin)
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user.id });
      if (doctorProfile) {
        query.doctor = doctorProfile._id;
      } else {
        return res.json({ success: true, count: 0, appointments: [] });
      }
    }
    // Admin sees all

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctor',
        select: 'name specialization qualification clinic consultationFee image rating',
      })
      .populate('patient', 'name email phone avatar')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status (Confirm, Complete, Cancel)
// @route   PUT /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    return res.json({
      success: true,
      message: `Appointment marked as ${status}`,
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
export const cancelAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.json({
      success: true,
      message: 'Appointment successfully cancelled',
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
