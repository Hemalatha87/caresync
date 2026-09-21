import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Star, MapPin, Award, CheckCircle2, Calendar, Clock, DollarSign,
  ShieldCheck, User, Phone, Mail, FileText, Check, AlertCircle, ArrowLeft, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [docImg, setDocImg] = useState('');

  // Booking Flow State
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        const [docRes, revRes] = await Promise.all([
          doctorAPI.getById(id),
          reviewAPI.getByDoctor(id),
        ]);
        if (docRes.data.success) {
          setDoctor(docRes.data.doctor);
          setDocImg(docRes.data.doctor.image || DEFAULT_FALLBACK_IMAGE);
          // Auto select first slot
          const firstDaySlots = docRes.data.doctor.availability?.[0]?.slots || ['09:00 AM', '10:30 AM', '02:00 PM'];
          if (firstDaySlots.length > 0) setSelectedSlot(firstDaySlots[0]);
        }
        if (revRes.data.success) {
          setReviews(revRes.data.reviews);
        }
      } catch (err) {
        console.error('Error loading doctor details', err);
      } finally {
        setLoading(false);
      }
    };
    loadDoctorData();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!patientName) setPatientName(user.name);
      if (!patientEmail) setPatientEmail(user.email);
      if (!patientPhone) setPatientPhone(user.phone || '');
    }
  }, [user]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(`/doctors/${id}`));
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setBookingError('Please select both a appointment date and time slot.');
      return;
    }

    if (!patientName || !patientEmail || !patientPhone) {
      setBookingError('Please fill out all patient contact information.');
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        doctorId: id,
        date: selectedDate,
        timeSlot: selectedSlot,
        patientName,
        patientEmail,
        patientPhone,
        reason: reason || 'General Consultation',
      };

      const res = await appointmentAPI.create(payload);
      if (res.data.success) {
        setCreatedAppointment(res.data.appointment);
        setBookingSuccessModal(true);
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book appointment. Please try another slot.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    if (!newComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await reviewAPI.add({
        doctorId: id,
        rating: newRating,
        comment: newComment,
      });
      if (res.data.success) {
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
        setDoctor(prev => ({ ...prev, rating: res.data.doctorRating, reviewsCount: res.data.reviewsCount }));
      }
    } catch (err) {
      console.error('Failed to post review', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 dark:bg-[#080E1E]">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center bg-slate-50 dark:bg-[#080E1E]">
        <p className="text-lg text-slate-700 dark:text-slate-200 font-bold">Doctor profile not found.</p>
        <button onClick={() => navigate('/doctors')} className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl">
          Back to Doctors
        </button>
      </div>
    );
  }

  const availableSlots = doctor.availability?.[0]?.slots || ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Link */}
        <button
          onClick={() => navigate('/doctors')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Doctor Directory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Doctor Profile Header & Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Header Profile Card */}
            <div className="bg-white dark:bg-[#111B33] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border-2 border-brand-100 dark:border-slate-700 shadow-sm">
                <img
                  src={docImg}
                  alt={doctor.name}
                  onError={() => setDocImg(DEFAULT_FALLBACK_IMAGE)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-cyan-400 text-xs font-bold uppercase">
                    {doctor.specialization}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{doctor.rating}</span>
                    <span className="text-slate-400 dark:text-slate-500">({doctor.reviewsCount} reviews)</span>
                  </div>
                  {doctor.isVerified && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Verified
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{doctor.name}</h1>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{doctor.qualification}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                    <span>{doctor.experience} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                    <span className="truncate">{doctor.clinic?.city || 'City Center'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>${doctor.consultationFee} Consultation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="bg-white dark:bg-[#111B33] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-6">
              <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6">
                {['overview', 'clinic', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold capitalize transition-all border-b-2 ${
                      activeTab === tab
                        ? 'border-brand-600 dark:border-cyan-400 text-brand-600 dark:text-cyan-400'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">About {doctor.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{doctor.bio || 'Dedicated medical practitioner focused on providing high quality, patient-centered clinical care.'}</p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Core Services</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl"><Check className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> Comprehensive Health Evaluation</li>
                      <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl"><Check className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> Specialized Treatment Planning</li>
                      <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl"><Check className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> Follow-up Diagnostic Review</li>
                      <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl"><Check className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> Preventive Care Guidance</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Clinic */}
              {activeTab === 'clinic' && (
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="font-bold text-slate-900 dark:text-white text-base">{doctor.clinic?.name || 'CareSync Medical Hub'}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> {doctor.clinic?.address}, {doctor.clinic?.city}</p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Mon - Fri: 09:00 AM - 05:00 PM</p>
                  </div>
                </div>
              )}

              {/* Tab 3: Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Add Review Form */}
                  {isAuthenticated && (
                    <form onSubmit={handleAddReview} className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-750 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Write a Patient Review</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="p-1"
                          >
                            <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Share your experience with this doctor..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No reviews posted yet. Be the first to review!</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev._id} className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.patientName}</span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block pt-1">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Interactive Booking Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[#111B33] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Consultation Fee</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">${doctor.consultationFee}</span>
              </div>

              {bookingError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                {/* Step 1: Select Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> 1. Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                {/* Step 2: Select Time Slot */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> 2. Select Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          selectedSlot === slot
                            ? 'bg-brand-600 dark:bg-cyan-600 text-white border-brand-600 dark:border-cyan-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-cyan-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Patient Information */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> 3. Patient Details
                  </label>

                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />

                  <input
                    type="text"
                    placeholder="Reason for Visit (Optional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                {/* Submit Booking Button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white text-sm font-bold shadow-md shadow-brand-600/20 hover:shadow-lg transition-all"
                >
                  {bookingLoading ? 'Processing Booking...' : 'Confirm Appointment'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Booking Success Confirmation Modal */}
      <AnimatePresence>
        {bookingSuccessModal && createdAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#111B33] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your booking has been registered with CareSync.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl text-left space-y-2 text-xs border border-slate-200/80 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Doctor:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Date:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{createdAppointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Time:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{createdAppointment.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Booking ID:</span>
                  <span className="font-mono font-bold text-brand-600 dark:text-cyan-400">{createdAppointment._id?.slice(-8)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setBookingSuccessModal(false);
                  navigate('/dashboard/patient');
                }}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                View My Appointments
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
