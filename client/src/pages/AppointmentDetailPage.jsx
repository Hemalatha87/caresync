import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar, Clock, MapPin, User, CheckCircle2, XCircle, AlertCircle,
  FileText, Video, Building2, ArrowLeft, Phone, Mail, ShieldCheck,
  CreditCard, ExternalLink, RefreshCw
} from 'lucide-react';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointment = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await appointmentAPI.getById(id);
      if (res.data.success) {
        setAppointment(res.data.appointment);
      }
    } catch (err) {
      console.error('Error fetching appointment', err);
      setError(err.response?.data?.message || 'Appointment not found or you are not authorized to view it.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      const res = await appointmentAPI.updateStatus(id, newStatus);
      if (res.data.success) {
        setAppointment(res.data.appointment);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setActionLoading(true);
    try {
      const res = await appointmentAPI.cancel(id);
      if (res.data.success) {
        setAppointment(prev => ({ ...prev, status: 'CANCELLED' }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 dark:bg-[#080E1E]">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 dark:bg-[#080E1E] px-4">
        <div className="bg-white dark:bg-[#111B33] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unable to View Appointment</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error || 'Appointment details are not available.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const doctor = appointment.doctor;
  const patient = appointment.patient;
  const statusUpper = (appointment.status || 'PENDING').toUpperCase();
  const isDoctor = user?.role === 'doctor';
  const bookingId = appointment.bookingId || `CS-${appointment._id?.slice(-8).toUpperCase()}`;
  const fee = appointment.fee || appointment.amount || doctor?.consultationFee || 0;

  const statusStyles = {
    CONFIRMED: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    PENDING: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    COMPLETED: 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    CANCELLED: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    REJECTED: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(isDoctor ? '/dashboard/doctor' : '/dashboard/patient')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Main Appointment Summary Card */}
        <div className="bg-white dark:bg-[#111B33] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Booking Reference
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {bookingId}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Booked on {new Date(appointment.createdAt || Date.now()).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyles[statusUpper] || statusStyles.PENDING}`}>
                {statusUpper}
              </span>
            </div>
          </div>

          {/* Doctor & Patient Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Doctor Info Card */}
            <div className="bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Assigned Healthcare Specialist</span>
                {doctor?._id && (
                  <Link to={`/doctors/${doctor._id}`} className="text-xs font-bold text-brand-600 dark:text-cyan-400 flex items-center gap-1 hover:underline">
                    <span>Profile</span> <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                  <img
                    src={doctor?.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                    alt={doctor?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{doctor?.name || 'Dr. Specialist'}</h3>
                  <p className="text-xs font-semibold text-brand-600 dark:text-cyan-400">{doctor?.specialization || 'Medical Specialist'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{doctor?.qualification || 'MBBS, MD'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
                  <span>{doctor?.location || doctor?.clinic?.city || 'Tenali'}, {doctor?.clinic?.name || 'CareSync Health Hub'}</span>
                </p>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase text-slate-400 block">Patient Details</span>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-xl shrink-0">
                  {(appointment.patientName || patient?.name || 'P').charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {appointment.patientName || patient?.name || 'Patient'}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Registered Patient</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
                  <span>{appointment.patientPhone || patient?.phone || 'N/A'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
                  <span>{appointment.patientEmail || patient?.email || 'N/A'}</span>
                </p>
              </div>
            </div>

          </div>

          {/* Consultation Schedule Details */}
          <div className="bg-slate-50/80 dark:bg-slate-850/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Consultation Particulars</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block">Date</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{appointment.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block">Time Slot</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{appointment.timeSlot || appointment.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  {appointment.consultationType === 'Video Consultation' ? <Video className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-slate-400 block">Consultation Type</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{appointment.consultationType || 'In-Clinic'}</span>
                </div>
              </div>
            </div>

            {appointment.reason && (
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Reason for Visit: </span>
                <span className="text-slate-600 dark:text-slate-400">{appointment.reason}</span>
              </div>
            )}
          </div>

          {/* Payment & Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Total Consultation Fee</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{fee}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isDoctor ? (
                <>
                  {statusUpper === 'PENDING' && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusChange('CONFIRMED')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
                      >
                        Confirm Appointment
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusChange('REJECTED')}
                        className="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {statusUpper === 'CONFIRMED' && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusChange('COMPLETED')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark as Completed</span>
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusChange('CANCELLED')}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-bold transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {(statusUpper === 'PENDING' || statusUpper === 'CONFIRMED') && (
                    <button
                      disabled={actionLoading}
                      onClick={handleCancel}
                      className="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all shadow-xs"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
