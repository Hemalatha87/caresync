import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// @desc    Book a new appointment with double-booking prevention & unique booking ID
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, patientName, patientEmail, patientPhone, reason, notes, consultationType } = req.body;

    if (!doctorId || !date || !timeSlot || !patientName || !patientEmail || !patientPhone) {
      return res.status(400).json({ success: false, message: 'Please fill all required appointment fields' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Selected doctor was not found' });
    }

    // Double Booking Prevention: Check if slot already booked for this doctor on date & time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: date.trim(),
      timeSlot: timeSlot.trim(),
      status: { $in: ['PENDING', 'CONFIRMED', 'pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this time slot is no longer available. Please select another slot.',
      });
    }

    // Generate unique formatted Booking ID: CS-YYYYMMDD-XXXXX
    const dateFormatted = date.replace(/-/g, '');
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `CS-${dateFormatted}-${randomSuffix}`;

    const appointment = await Appointment.create({
      bookingId,
      patient: req.user.id,
      doctor: doctorId,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      date: date.trim(),
      timeSlot: timeSlot.trim(),
      consultationType: consultationType || 'In-Clinic',
      reason: reason || 'General Consultation',
      notes: notes || '',
      amount: doctor.consultationFee,
      fee: doctor.consultationFee,
      status: 'CONFIRMED',
      paymentStatus: 'paid',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar');

    return res.status(201).json({
      success: true,
      message: 'Appointment successfully booked!',
      bookingId: appointment.bookingId,
      appointment: populatedAppointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments with status/date/search filtering (Patient / Doctor / Admin)
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    const { status, date, consultationType, search } = req.query;
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

    // Filter by status if provided
    if (status && status !== 'All') {
      const s = status.toUpperCase();
      if (s === 'UPCOMING') {
        query.status = { $in: ['CONFIRMED', 'PENDING'] };
      } else {
        query.status = s;
      }
    }

    // Filter by date if provided
    if (date) {
      query.date = date;
    }

    // Filter by consultationType
    if (consultationType && consultationType !== 'All') {
      query.consultationType = consultationType;
    }

    // Filter by search term (patientName, bookingId)
    if (search && search.trim()) {
      query.$or = [
        { patientName: { $regex: search.trim(), $options: 'i' } },
        { bookingId: { $regex: search.trim(), $options: 'i' } },
        { reason: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctor',
        select: 'name specialization qualification clinic consultationFee image rating gender location',
      })
      .populate('patient', 'name email phone avatar')
      .sort({ date: -1, createdAt: -1 });

    return res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single appointment details by ID
// @route   GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify access
    const isPatient = req.user.role === 'patient' && appointment.patient._id.toString() === req.user.id;
    const isDoctor = req.user.role === 'doctor' && appointment.doctor?.user?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this appointment' });
    }

    return res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status (CONFIRMED, COMPLETED, CANCELLED, REJECTED)
// @route   PUT /api/appointments/:id/status or PATCH /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  try {
    let { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    status = status.toUpperCase();
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar');

    return res.json({
      success: true,
      message: `Appointment status successfully updated to ${status}`,
      appointment: updatedAppointment,
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

    appointment.status = 'CANCELLED';
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
