import Doctor from '../models/Doctor.js';

// @desc    Get all doctors with filtering & search
// @route   GET /api/doctors
export const getDoctors = async (req, res) => {
  try {
    const { search, specialization, city, minFee, maxFee, minRating, minExperience, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { 'clinic.name': { $regex: search, $options: 'i' } },
        { 'clinic.city': { $regex: search, $options: 'i' } },
      ];
    }

    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (city) {
      query['clinic.city'] = { $regex: city, $options: 'i' };
    }

    if (minFee || maxFee) {
      query.consultationFee = {};
      if (minFee) query.consultationFee.$gte = Number(minFee);
      if (maxFee) query.consultationFee.$lte = Number(maxFee);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (minExperience) {
      query.experience = { $gte: Number(minExperience) };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'fee-low') sortOptions = { consultationFee: 1 };
    if (sort === 'fee-high') sortOptions = { consultationFee: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'experience') sortOptions = { experience: -1 };

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

// @desc    Get single doctor profile by ID
// @route   GET /api/doctors/:id
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatar');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({ success: true, doctor });
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
