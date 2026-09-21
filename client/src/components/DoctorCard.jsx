import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, CheckCircle2, ArrowRight, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorCard({ doctor }) {
  if (!doctor) return null;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* Doctor Header & Image */}
        <div className="relative mb-4 overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3]">
          <img
            src={doctor.image || doctor.user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
            alt={doctor.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-800">{doctor.rating || 4.8}</span>
            <span className="text-[10px] text-slate-400">({doctor.reviewsCount || 0})</span>
          </div>

          {doctor.isVerified && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-md text-[11px] font-semibold flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </div>
          )}
        </div>

        {/* Doctor Title & Specialization */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="inline-block px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold tracking-wide uppercase">
            {doctor.specialization}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Award className="w-3.5 h-3.5 text-brand-600" />
            <span>{doctor.experience} Yrs Exp</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
          {doctor.name}
        </h3>

        <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1">
          {doctor.qualification}
        </p>

        {/* Clinic & Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{doctor.clinic?.name || 'CareSync Clinic'}, {doctor.clinic?.city || 'City Center'}</span>
        </div>
      </div>

      {/* Fee & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Consultation Fee</span>
          <span className="text-base font-extrabold text-slate-900">${doctor.consultationFee}</span>
        </div>

        <Link
          to={`/doctors/${doctor._id}`}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 hover:shadow-lg transition-all duration-200"
        >
          Book Visit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
