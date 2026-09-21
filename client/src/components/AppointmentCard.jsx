import React from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, AlertCircle, FileText, Video, Building2, ExternalLink, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AppointmentCard({
  appointment,
  isDoctorView = false,
  onStatusChange,
  onCancel
}) {
  if (!appointment) return null;

  const doctor = appointment.doctor;
  const patient = appointment.patient;
  const statusUpper = (appointment.status || 'PENDING').toUpperCase();

  const statusStyles = {
    CONFIRMED: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    PENDING: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    COMPLETED: 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    CANCELLED: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    REJECTED: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  };

  const statusIcons = {
    CONFIRMED: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    PENDING: <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
    COMPLETED: <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
    CANCELLED: <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
    REJECTED: <XCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
  };

  const bookingId = appointment.bookingId || (appointment._id ? `CS-${appointment._id.slice(-8).toUpperCase()}` : 'CS-PENDING');
  const amount = appointment.fee || appointment.amount || doctor?.consultationFee || 0;
  const consultationType = appointment.consultationType || 'In-Clinic';

  return (
    <div className="bg-white dark:bg-[#111B33] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
            <img
              src={
                isDoctorView
                  ? (patient?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200')
                  : (doctor?.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200')
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isDoctorView ? (appointment.patientName || patient?.name || 'Patient') : (doctor?.name || 'Dr. Specialist')}
              </h4>
              <span className="font-mono text-[10px] font-bold text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-900/60">
                {bookingId}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isDoctorView
                ? `Phone: ${appointment.patientPhone || patient?.phone || 'N/A'}`
                : `${doctor?.specialization || 'General'} • ${doctor?.location || doctor?.clinic?.city || 'Tenali'}`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[statusUpper] || statusStyles.PENDING}`}>
            {statusIcons[statusUpper]}
            <span>{statusUpper}</span>
          </span>
        </div>
      </div>

      {/* Appointment Date, Time, Type & Fee Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 py-3 bg-slate-50/80 dark:bg-slate-850/60 rounded-2xl px-4 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Date</span>
            <span className="font-bold">{appointment.date}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Time</span>
            <span className="font-bold">{appointment.timeSlot || appointment.time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          {consultationType === 'Video Consultation' ? (
            <Video className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          ) : (
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          )}
          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Consultation</span>
            <span className="font-bold truncate">{consultationType}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Fee</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{amount}</span>
          </div>
        </div>
      </div>

      {appointment.reason && (
        <div className="mb-4 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 bg-slate-100/60 dark:bg-slate-850/80 p-2.5 rounded-xl">
          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span><strong className="text-slate-800 dark:text-white">Reason:</strong> {appointment.reason}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <Link
          to={`/appointments/${appointment._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-cyan-400 hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Details</span>
        </Link>

        <div className="flex items-center gap-2">
          {isDoctorView ? (
            <>
              {statusUpper === 'PENDING' && (
                <>
                  <button
                    onClick={() => onStatusChange?.(appointment._id, 'CONFIRMED')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onStatusChange?.(appointment._id, 'REJECTED')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all"
                  >
                    Reject
                  </button>
                </>
              )}

              {statusUpper === 'CONFIRMED' && (
                <>
                  <button
                    onClick={() => onStatusChange?.(appointment._id, 'COMPLETED')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => onStatusChange?.(appointment._id, 'CANCELLED')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {(statusUpper === 'CONFIRMED' || statusUpper === 'PENDING') && (
                <button
                  onClick={() => onCancel?.(appointment._id)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all"
                >
                  Cancel Appointment
                </button>
              )}
              {statusUpper === 'COMPLETED' && doctor?._id && (
                <Link
                  to={`/doctors/${doctor._id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-cyan-400 text-xs font-bold hover:bg-brand-100 transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Leave Review</span>
                </Link>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}
