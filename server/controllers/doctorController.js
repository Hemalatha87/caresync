import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all doctors with advanced filtering & search
// @route   GET /api/doctors
export const getDoctors = async (req, res) => {
  try {
    const {
      search,
      name,
      specialization,
      location,
      city,
      gender,
      consultationType,
      minFee,
      maxFee,
      minRating,
      rating,
      minExperience,
      experience,
      availability,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // 1. Name or General Search
    const searchVal = search || name;
    if (searchVal && searchVal.trim()) {
      const term = searchVal.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { specialization: { $regex: term, $options: 'i' } },
        { 'clinic.name': { $regex: term, $options: 'i' } },
        { 'clinic.city': { $regex: term, $options: 'i' } },
        { 'clinic.address': { $regex: term, $options: 'i' } },
        { location: { $regex: term, $options: 'i' } },
      ];
    }

    // 2. Specialization Filter
    if (specialization && specialization !== 'All' && specialization.trim()) {
      query.specialization = { $regex: specialization.trim(), $options: 'i' };
    }

    // 3. Location / City Filter
    const locationVal = location || city;
    if (locationVal && locationVal.trim()) {
      const locTerm = locationVal.trim();
      query.$or = [
        ...(query.$or || []),
        { 'clinic.city': { $regex: locTerm, $options: 'i' } },
        { 'clinic.address': { $regex: locTerm, $options: 'i' } },
        { location: { $regex: locTerm, $options: 'i' } },
      ];
    }

    // 4. Gender Filter
    if (gender && gender !== 'All' && gender.trim()) {
      query.gender = { $regex: `^${gender.trim()}$`, $options: 'i' };
    }

    // 5. Consultation Type Filter
    if (consultationType && consultationType !== 'All' && consultationType.trim()) {
      const cType = consultationType.trim();
      if (cType === 'In-Clinic') {
        query.consultationType = { $in: ['In-Clinic', 'Both'] };
      } else if (cType === 'Video' || cType === 'Video Consultation') {
        query.consultationType = { $in: ['Video Consultation', 'Both'] };
      } else {
        query.consultationType = { $regex: cType, $options: 'i' };
      }
    }

    // 6. Consultation Fee Range
    if (minFee || maxFee) {
      query.consultationFee = {};
      if (minFee) query.consultationFee.$gte = Number(minFee);
      if (maxFee) query.consultationFee.$lte = Number(maxFee);
    }

    // 7. Rating Threshold
    const ratingVal = minRating || rating;
    if (ratingVal) {
      query.rating = { $gte: Number(ratingVal) };
    }

    // 8. Experience Threshold
    const expVal = minExperience || experience;
    if (expVal) {
      query.experience = { $gte: Number(expVal) };
    }

    // 9. Availability Filter
    if (availability && availability !== 'All') {
      const avail = availability.toLowerCase();
      if (avail === 'today' || avail === 'available today') {
        query['availability.0'] = { $exists: true };
      } else if (avail === 'tomorrow' || avail === 'available tomorrow') {
        query['availability.0'] = { $exists: true };
      }
    }

    // 10. Sorting
    let sortOptions = { rating: -1, createdAt: -1 };
    if (sort === 'fee-low' || sort === 'Consultation Fee: Low to High') sortOptions = { consultationFee: 1 };
    if (sort === 'fee-high' || sort === 'Consultation Fee: High to Low') sortOptions = { consultationFee: -1 };
    if (sort === 'rating' || sort === 'Rating: High to Low') sortOptions = { rating: -1 };
    if (sort === 'experience' || sort === 'Experience: High to Low') sortOptions = { experience: -1 };
    if (sort === 'earliest' || sort === 'Earliest Availability') sortOptions = { 'availability.0': -1, rating: -1 };
    if (sort === 'relevance') sortOptions = { rating: -1, createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .populate('user', 'name email phone avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    return res.json({
      success: true,
      count: doctors.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      doctors,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single doctor profile by ID with booked slots for selected date
// @route   GET /api/doctors/:id
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatar');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check if query contains date to return booked slots
    let bookedSlots = [];
    const { date } = req.query;
    if (date) {
      const activeAppointments = await Appointment.find({
        doctor: doctor._id,
        date: date.trim(),
        status: { $in: ['CONFIRMED', 'PENDING', 'confirmed', 'pending'] },
      }).select('timeSlot');

      bookedSlots = activeAppointments.map((a) => a.timeSlot);
    }

    return res.json({
      success: true,
      doctor,
      bookedSlots,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor profile (for logged in doctor)
// @route   PUT /api/doctors/:id
export const updateDoctorProfile = async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Verify ownership or admin
    if (doctor.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this doctor profile' });
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return res.json({ success: true, doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
