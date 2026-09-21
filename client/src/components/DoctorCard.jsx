import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, CheckCircle2, ArrowRight, Video, Building2, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';

export default function DoctorCard({ doctor }) {
  const [imgSrc, setImgSrc] = useState(
    doctor?.image || doctor?.user?.avatar || DEFAULT_FALLBACK_IMAGE
  );
  const [imgError, setImgError] = useState(false);

  if (!doctor) return null;

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(DEFAULT_FALLBACK_IMAGE);
    }
  };

  const consultationType = doctor.consultationType || 'Both';
  const locationDisplay = doctor.location || `${doctor.clinic?.city || 'City Center'}, ${doctor.clinic?.name || 'Clinic'}`;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white dark:bg-[#111B33] rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl dark:hover:shadow-2xl hover:border-brand-300 dark:hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* Doctor Header & Image */}
        <div className="relative mb-4 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 aspect-[4/3]">
          <img
            src={imgSrc}
            alt={doctor.name}
            onError={handleImageError}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{doctor.rating || 4.8}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400">({doctor.reviewsCount || 0})</span>
          </div>

          {doctor.isVerified && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/95 text-white backdrop-blur-md text-[11px] font-semibold flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </div>
          )}
        </div>

        {/* Doctor Title & Specialization */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="inline-block px-3 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-cyan-400 text-xs font-bold tracking-wide uppercase">
            {doctor.specialization}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Award className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
            <span>{doctor.experience} Yrs Exp</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
          {doctor.name}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3 line-clamp-1">
          {doctor.qualification}
        </p>

        {/* Location / City */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-2.5 bg-slate-50 dark:bg-slate-850/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400 shrink-0" />
          <span className="truncate font-medium">{locationDisplay}</span>
        </div>

        {/* Consultation Types & Availability Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {(consultationType === 'Video Consultation' || consultationType === 'Both') && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800/60">
              <Video className="w-3 h-3" /> Video
            </span>
          )}
          {(consultationType === 'In-Clinic' || consultationType === 'Both') && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800/60">
              <Building2 className="w-3 h-3" /> In-Clinic
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60">
            <Clock className="w-3 h-3" /> {doctor.nextAvailableSlot || 'Available Today'}
          </span>
        </div>
      </div>

      {/* Fee & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Fee</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{doctor.consultationFee}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/doctors/${doctor._id}`}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            View Profile
          </Link>
          <Link
            to={`/doctors/${doctor._id}`}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-brand-600/20 hover:shadow-lg transition-all duration-200"
          >
            Book Visit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
