import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { doctorAPI, appointmentAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeartbeatPulse from '../components/animations/HeartbeatPulse';
import {
  Star, MapPin, Award, CheckCircle2, Calendar, Clock,
  ShieldCheck, User, Phone, Mail, FileText, Check, AlertCircle, ArrowLeft,
  Video, Building2, Sparkles, ExternalLink, Baby, UserRound, Accessibility, Users
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
  const [bookedSlots, setBookedSlots] = useState([]);

  const [searchParams] = useSearchParams();
  const ageGroupContext = searchParams.get('ageGroup');

  // Booking Flow State
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationType, setConsultationType] = useState('In-Clinic');
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

  // Load doctor details and booked slots for selectedDate
  const loadDoctorData = async (targetDate = selectedDate) => {
    try {
      const [docRes, revRes] = await Promise.all([
        doctorAPI.getById(id, { date: targetDate }),
        reviewAPI.getByDoctor(id),
      ]);
      if (docRes.data.success) {
        const doc = docRes.data.doctor;
        setDoctor(doc);
        setDocImg(doc.profileImage || doc.image || doc.user?.avatar || DEFAULT_FALLBACK_IMAGE);
        setBookedSlots(docRes.data.bookedSlots || []);

        // Set default consultation type
        if (doc.consultationType === 'Video Consultation') {
          setConsultationType('Video Consultation');
        } else if (doc.consultationType === 'Both') {
          setConsultationType('Video Consultation');
        } else {
          setConsultationType('In-Clinic');
        }

        // Available slots for doctor
        const dayAvailability = doc.availability?.find(a => a.date === targetDate);
        const daySlots = dayAvailability?.slots || doc.availability?.[0]?.slots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];
        
        // Auto select first available (unbooked) slot
        const availableSlot = daySlots.find(s => !(docRes.data.bookedSlots || []).includes(s));
        if (availableSlot) {
          setSelectedSlot(availableSlot);
        } else {
          setSelectedSlot('');
        }
      }
      if (revRes.data.success) {
        setReviews(revRes.data.reviews || []);
      }
    } catch (err) {
      console.error('Error loading doctor details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData(selectedDate);
  }, [id, selectedDate]);

  useEffect(() => {
    if (user) {
      if (!patientName) setPatientName(user.name || '');
      if (!patientEmail) setPatientEmail(user.email || '');
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
      setBookingError('Please select both an appointment date and an available time slot.');
      return;
    }

    if (bookedSlots.includes(selectedSlot)) {
      setBookingError('Sorry, this time slot is no longer available. Please select another slot.');
      return;
    }

    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim()) {
      setBookingError('Please fill out all required patient contact information.');
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        doctorId: id,
        date: selectedDate,
        timeSlot: selectedSlot,
        consultationType,
        patientName,
        patientEmail,
        patientPhone,
        reason: reason.trim() || 'General Consultation',
      };

      const res = await appointmentAPI.create(payload);
      if (res.data.success) {
        setCreatedAppointment(res.data.appointment);
        setBookingSuccessModal(true);
        // Refresh booked slots list
        setBookedSlots(prev => [...prev, selectedSlot]);
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Sorry, this time slot is no longer available. Please select another slot.');
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
      const res = await reviewAPI.create({
        doctorId: id,
        rating: newRating,
        comment: newComment.trim(),
      });
      if (res.data.success) {
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
        setNewRating(5);
        if (doctor) {
          setDoctor({
            ...doctor,
            rating: (
              (doctor.rating * (doctor.reviewsCount || 0) + newRating) /
              ((doctor.reviewsCount || 0) + 1)
            ).toFixed(1),
            reviewsCount: (doctor.reviewsCount || 0) + 1,
          });
        }
      }
    } catch (err) {
      console.error('Error submitting review', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-4 animate-pulse space-y-6">
        <div className="h-64 bg-white dark:bg-[#111B33] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-white dark:bg-[#111B33] rounded-3xl" />
          <div className="lg:col-span-4 h-96 bg-white dark:bg-[#111B33] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center bg-slate-50 dark:bg-[#080E1E]">
        <p className="text-lg text-slate-700 dark:text-slate-200 font-bold">Doctor profile not found.</p>
        <button onClick={() => navigate('/doctors')} className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl font-bold text-xs">
          Back to Doctors
        </button>
      </div>
    );
  }

  // Doctor availability slots for selected date
  const dayAvailability = doctor.availability?.find(a => a.date === selectedDate);
  const slotsList = dayAvailability?.slots || doctor.availability?.[0]?.slots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-8 space-y-6"
          >
            
            {/* Main Header Profile Card */}
            <div className="bg-white dark:bg-[#111B33] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border-2 border-brand-100 dark:border-slate-700 shadow-sm group">
                <img
                  src={docImg}
                  alt={doctor.name}
                  onError={() => setDocImg(DEFAULT_FALLBACK_IMAGE)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <span className="text-slate-400 dark:text-slate-500">({doctor.reviewsCount || 0} reviews)</span>
                  </div>
                  {doctor.isVerified && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Verified
                    </span>
                  )}
                  
                  {/* Subtle Availability Status Pulse */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Available Today</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{doctor.name}</h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">{doctor.qualification}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
                    <span>{doctor.experience} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
                    <span className="truncate">{doctor.location || doctor.clinic?.city || 'Tenali'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹{doctor.consultationFee}</span>
                    <span>Consultation</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Consultation Type:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold">
                    {doctor.consultationType === 'Video Consultation' ? <Video className="w-3.5 h-3.5 text-cyan-500" /> : <Building2 className="w-3.5 h-3.5 text-brand-500" />}
                    {doctor.consultationType || 'In-Clinic & Video'}
                  </span>
                </div>

                {/* Provides Care For (Age Groups) */}
                {doctor.patientAgeGroups && doctor.patientAgeGroups.length > 0 && (
                  <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Provides Care For:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {doctor.patientAgeGroups.includes('kids') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-800/60">
                          👶 Kids (0–17 yrs)
                        </span>
                      )}
                      {doctor.patientAgeGroups.includes('adults') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/60">
                          🧑 Adults (18–59 yrs)
                        </span>
                      )}
                      {doctor.patientAgeGroups.includes('seniors') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800/60">
                          👴 Seniors (60+ yrs)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="bg-white dark:bg-[#111B33] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-6">
              <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6">
                {['overview', 'clinic', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs sm:text-sm font-bold capitalize transition-all border-b-2 ${
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
                <div className="space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">About {doctor.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{doctor.bio || 'Dedicated medical practitioner focused on providing high quality, patient-centered clinical care.'}</p>
                  </div>

                  {/* Age Groups In Tab 1 */}
                  {doctor.patientAgeGroups && doctor.patientAgeGroups.length > 0 && (
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">Patient Age Demographics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {doctor.patientAgeGroups.includes('kids') && (
                          <div className="p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-800/60 flex items-start gap-2.5">
                            <span className="text-xl">👶</span>
                            <div>
                              <p className="font-bold text-cyan-900 dark:text-cyan-200 text-xs">Kids Care</p>
                              <p className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">Ages 0–17 Years</p>
                            </div>
                          </div>
                        )}
                        {doctor.patientAgeGroups.includes('adults') && (
                          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-2.5">
                            <span className="text-xl">🧑</span>
                            <div>
                              <p className="font-bold text-blue-900 dark:text-blue-200 text-xs">Adult Care</p>
                              <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">Ages 18–59 Years</p>
                            </div>
                          </div>
                        )}
                        {doctor.patientAgeGroups.includes('seniors') && (
                          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start gap-2.5">
                            <span className="text-xl">👴</span>
                            <div>
                              <p className="font-bold text-indigo-900 dark:text-indigo-200 text-xs">Senior Care</p>
                              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">Ages 60+ Years</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">Core Services & Specializations</h3>
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
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{doctor.clinic?.name || 'CareSync Medical Centre'}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> {doctor.clinic?.address || 'Main Road'}, {doctor.location || doctor.clinic?.city || 'Tenali'}</p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Mon - Sat: 09:00 AM - 06:00 PM</p>
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
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.patientName || 'Verified Patient'}</span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(rev.rating || 5)].map((_, i) => (
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
          </motion.div>

          {/* Right Column: Interactive Booking Flow Panel */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white dark:bg-[#111B33] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg sticky top-28 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">Consultation Fee</span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{doctor.consultationFee}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-400 block">Location</span>
                  <span className="text-xs font-bold text-brand-600 dark:text-cyan-400">{doctor.location || doctor.clinic?.city || 'Tenali'}</span>
                </div>
              </div>

              {bookingError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              {ageGroupContext && (
                <div className="p-3 bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-900/60 rounded-2xl text-xs font-semibold text-brand-800 dark:text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
                  <span>
                    Care Discovery:{' '}
                    <strong>
                      {ageGroupContext === 'kids'
                        ? '👶 Kids Care (0–17 yrs)'
                        : ageGroupContext === 'adults'
                        ? '🧑 Adult Care (18–59 yrs)'
                        : '👴 Senior Care (60+ yrs)'}
                    </strong>
                  </span>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* 1. Select Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> 1. Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* 2. Select Consultation Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> 2. Consultation Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('In-Clinic')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        consultationType === 'In-Clinic'
                          ? 'bg-brand-600 dark:bg-cyan-600 text-white border-brand-600 dark:border-cyan-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" /> In-Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('Video Consultation')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        consultationType === 'Video Consultation'
                          ? 'bg-brand-600 dark:bg-cyan-600 text-white border-brand-600 dark:border-cyan-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Video Call
                    </button>
                  </div>
                </div>

                {/* 3. Select Time Slot with Micro-Interactions */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> 3. Select Available Slot
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">{slotsList.length - bookedSlots.length} available</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slotsList.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedSlot === slot;

                      return (
                        <button
                          type="button"
                          key={slot}
                          disabled={isBooked}
                          onClick={() => {
                            if (!isBooked) setSelectedSlot(slot);
                          }}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all duration-200 relative flex items-center justify-center gap-1 ${
                            isBooked
                              ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-brand-600 dark:bg-cyan-600 text-white border-brand-600 dark:border-cyan-600 shadow-sm shadow-brand-600/20'
                              : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-cyan-500 hover:shadow-xs'
                          }`}
                        >
                          {isSelected && !isBooked && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.span>
                          )}
                          <span>{slot}</span>
                          {isBooked && (
                            <span className="block text-[9px] no-underline font-normal text-rose-500 ml-1">Booked</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Patient Information */}
                <div className="space-y-2.5 pt-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> 4. Patient Details
                  </label>

                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 transition-colors"
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 transition-colors"
                  />

                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 transition-colors"
                  />

                  <input
                    type="text"
                    placeholder="Reason for Visit (e.g. Skin rash, Checkup...)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* Submit Booking Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={bookingLoading || !selectedSlot}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-600/20 hover:shadow-lg transition-all"
                >
                  {bookingLoading ? 'Securing Slot...' : `Confirm & Book Appointment (₹${doctor.consultationFee})`}
                </motion.button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Booking Success Confirmation Modal with Premium Animation Sequence */}
      <AnimatePresence>
        {bookingSuccessModal && createdAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#111B33] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6"
            >
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                {/* Expanding pulse circle */}
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: [1, 1.4, 1.2], opacity: [0.8, 0.2, 0.4] }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-emerald-400/20"
                />
                
                {/* Heartbeat Pulse Icon Container */}
                <HeartbeatPulse duration={1.8} scaleMax={1.08}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2, stiffness: 400, damping: 18 }}
                    className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                </HeartbeatPulse>
              </div>

              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white"
                >
                  Appointment Confirmed!
                </motion.h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your appointment has been registered and confirmed in CareSync.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl text-left space-y-2.5 text-xs border border-slate-200/80 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Booking ID:</span>
                  <span className="font-mono font-bold text-brand-600 dark:text-cyan-400">{createdAppointment.bookingId || createdAppointment._id?.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Doctor:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Specialization:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{doctor.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Date & Time:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{createdAppointment.date} at {createdAppointment.timeSlot || createdAppointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Consultation Type:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{createdAppointment.consultationType || consultationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Fee:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{createdAppointment.amount || createdAppointment.fee || doctor.consultationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-400 font-semibold">Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{createdAppointment.status}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setBookingSuccessModal(false);
                    navigate(`/appointments/${createdAppointment._id}`);
                  }}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setBookingSuccessModal(false);
                    navigate('/dashboard/patient');
                  }}
                  className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  My Appointments
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
