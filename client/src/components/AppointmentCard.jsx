import React from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, AlertCircle, DollarSign, FileText } from 'lucide-react';

export default function AppointmentCard({ appointment, isDoctorView = false, onStatusChange, onCancel }) {
  if (!appointment) return null;

  const doctor = appointment.doctor;
  const patient = appointment.patient;

  const statusStyles = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200 icon-emerald',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-sky-50 text-sky-700 border-sky-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const statusIcons = {
    confirmed: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    pending: <AlertCircle className="w-4 h-4 text-amber-600" />,
    completed: <CheckCircle2 className="w-4 h-4 text-sky-600" />,
    cancelled: <XCircle className="w-4 h-4 text-rose-600" />,
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
            <img
              src={isDoctorView ? (patient?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200') : (doctor?.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200')}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              {isDoctorView ? appointment.patientName : doctor?.name || 'Dr. Specialist'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {isDoctorView ? `Phone: ${appointment.patientPhone}` : doctor?.specialization || 'General Consultation'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[appointment.status] || statusStyles.pending}`}>
            {statusIcons[appointment.status]}
            <span className="capitalize">{appointment.status}</span>
          </span>
        </div>
      </div>

      {/* Appointment Date & Time Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 py-3 bg-slate-50/70 rounded-2xl px-4 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
          <span className="font-semibold">{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
          <span className="font-semibold">{appointment.timeSlot}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">${appointment.amount} Paid</span>
        </div>
      </div>

      {appointment.reason && (
        <div className="mb-4 text-xs text-slate-600 flex items-start gap-2 bg-slate-100/50 p-2.5 rounded-xl">
          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span><strong className="text-slate-800">Reason:</strong> {appointment.reason}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {isDoctorView ? (
          <>
            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
              <button
                onClick={() => onStatusChange?.(appointment._id, 'completed')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Mark Completed
              </button>
            )}
            {appointment.status !== 'cancelled' && (
              <button
                onClick={() => onStatusChange?.(appointment._id, 'cancelled')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all"
              >
                Cancel
              </button>
            )}
          </>
        ) : (
          <>
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <button
                onClick={() => onCancel?.(appointment._id)}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all"
              >
                Cancel Appointment
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
