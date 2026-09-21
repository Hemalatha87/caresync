import Review from '../models/Review.js';
import Doctor from '../models/Doctor.js';

// @desc    Add review for a doctor
// @route   POST /api/reviews
export const addReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;

    if (!doctorId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const review = await Review.create({
      patient: req.user.id,
      doctor: doctorId,
      patientName: req.user.name,
      rating: Number(rating),
      comment,
    });

    // Update doctor average rating & reviewsCount
    const allDoctorReviews = await Review.find({ doctor: doctorId });
    const totalRating = allDoctorReviews.reduce((sum, r) => sum + r.rating, 0);
    doctor.reviewsCount = allDoctorReviews.length;
    doctor.rating = Number((totalRating / allDoctorReviews.length).toFixed(1));
    await doctor.save();

    return res.status(201).json({
      success: true,
      review,
      doctorRating: doctor.rating,
      reviewsCount: doctor.reviewsCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a doctor
// @route   GET /api/doctors/:id/reviews
export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
