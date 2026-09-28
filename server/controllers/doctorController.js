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
      isVerified,
      ageGroup,
      patientAgeGroup,
      patientAgeGroups,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const andConditions = [];

    // 1. Name / Keyword Search
    const searchVal = search || name;
    if (searchVal && searchVal.trim()) {
      const term = searchVal.trim();
      andConditions.push({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { specialization: { $regex: term, $options: 'i' } },
          { 'clinic.name': { $regex: term, $options: 'i' } },
          { 'clinic.city': { $regex: term, $options: 'i' } },
          { 'clinic.address': { $regex: term, $options: 'i' } },
          { location: { $regex: term, $options: 'i' } },
          { bio: { $regex: term, $options: 'i' } },
        ],
      });
    }

    // 2. Specialization Filter
    if (specialization && specialization !== 'All' && specialization.trim()) {
      andConditions.push({
        specialization: { $regex: specialization.trim(), $options: 'i' },
      });
    }

    // 3. Location / City Filter
    const locationVal = location || city;
    if (locationVal && locationVal !== 'All' && locationVal.trim()) {
      const locTerm = locationVal.trim();
      andConditions.push({
        $or: [
          { 'clinic.city': { $regex: locTerm, $options: 'i' } },
          { 'clinic.address': { $regex: locTerm, $options: 'i' } },
          { 'clinic.name': { $regex: locTerm, $options: 'i' } },
          { location: { $regex: locTerm, $options: 'i' } },
        ],
      });
    }

    // 4. Gender Filter
    if (gender && gender !== 'All' && gender.trim()) {
      andConditions.push({
        gender: { $regex: `^${gender.trim()}$`, $options: 'i' },
      });
    }

    // 5. Consultation Type Filter
    if (consultationType && consultationType !== 'All' && consultationType.trim()) {
      const cType = consultationType.trim();
      if (cType === 'In-Clinic') {
        andConditions.push({ consultationType: { $in: ['In-Clinic', 'Both'] } });
      } else if (cType === 'Video' || cType === 'Video Consultation') {
        andConditions.push({ consultationType: { $in: ['Video Consultation', 'Both'] } });
      } else {
        andConditions.push({ consultationType: { $regex: cType, $options: 'i' } });
      }
    }

    // 6. Consultation Fee Range
    if (minFee || maxFee) {
      const feeQuery = {};
      if (minFee) feeQuery.$gte = Number(minFee);
      if (maxFee) feeQuery.$lte = Number(maxFee);
      andConditions.push({ consultationFee: feeQuery });
    }

    // 7. Rating Threshold
    const ratingVal = minRating || rating;
    if (ratingVal) {
      andConditions.push({ rating: { $gte: Number(ratingVal) } });
    }

    // 8. Experience Threshold
    const expVal = minExperience || experience;
    if (expVal) {
      andConditions.push({ experience: { $gte: Number(expVal) } });
    }

    // 9. Verification Status
    if (isVerified !== undefined && isVerified !== '') {
      andConditions.push({ isVerified: isVerified === 'true' || isVerified === true });
    }

    // 10. Availability Filter
    if (availability && availability !== 'All') {
      const avail = availability.toLowerCase();
      if (avail === 'today' || avail === 'available today' || avail === 'tomorrow' || avail === 'available tomorrow') {
        andConditions.push({ 'availability.0': { $exists: true } });
      }
    }

    // 11. Patient Age Group Filter (Kids: 0-17, Adults: 18-59, Seniors: 60+)
    const ageGroupTerm = ageGroup || patientAgeGroup || patientAgeGroups;
    if (ageGroupTerm && ageGroupTerm !== 'All' && String(ageGroupTerm).trim()) {
      const normalizedAge = String(ageGroupTerm).trim().toLowerCase();
      if (['kids', 'adults', 'seniors'].includes(normalizedAge)) {
        andConditions.push({
          patientAgeGroups: normalizedAge,
        });
      }
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    // Sorting
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
      pages: Math.ceil(total / Number(limit)) || 1,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specialization counts
// @route   GET /api/doctors/specialization-counts
export const getSpecializationCounts = async (req, res) => {
  try {
    const countsAggregate = await Doctor.aggregate([
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {};
    countsAggregate.forEach((item) => {
      if (item._id) {
        counts[item._id] = item.count;
      }
    });

    return res.json({
      success: true,
      counts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single doctor profile by ID with booked slots for selected date
// @route   GET /api/doctors/:id
export const getDoctorById = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'specialization-counts') {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID' });
    }

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

// @desc    Update doctor profile (for logged in doctor or admin)
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
