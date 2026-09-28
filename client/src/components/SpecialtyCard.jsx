import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse, Sparkles, Brain, Baby, Bone, Stethoscope,
  Heart, Smile, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const specialtyStyles = {
  'General Physician': {
    icon: Stethoscope,
    badge: 'Primary Care',
    accentBg: 'from-brand-500/15 to-cyan-500/10 dark:from-brand-500/20 dark:to-cyan-500/10',
  },
  Cardiologist: {
    icon: HeartPulse,
    badge: 'Cardiovascular Care',
    accentBg: 'from-sky-500/15 to-blue-600/10 dark:from-sky-500/20 dark:to-blue-600/10',
  },
  Dermatologist: {
    icon: Sparkles,
    badge: 'Skin & Aesthetics',
    accentBg: 'from-cyan-500/15 to-sky-500/10 dark:from-cyan-500/20 dark:to-sky-500/10',
  },
  Pediatrician: {
    icon: Baby,
    badge: 'Child Healthcare',
    accentBg: 'from-blue-500/15 to-brand-400/10 dark:from-blue-500/20 dark:to-brand-400/10',
  },
  Neurologist: {
    icon: Brain,
    badge: 'Brain & Spine',
    accentBg: 'from-brand-600/15 to-sky-500/10 dark:from-brand-600/20 dark:to-sky-500/10',
  },
  Orthopedic: {
    icon: Bone,
    badge: 'Joints & Bones',
    accentBg: 'from-sky-600/15 to-cyan-500/10 dark:from-sky-600/20 dark:to-cyan-500/10',
  },
  Gynecologist: {
    icon: Heart,
    badge: 'Women Health',
    accentBg: 'from-cyan-600/15 to-blue-500/10 dark:from-cyan-600/20 dark:to-blue-500/10',
  },
  Dentist: {
    icon: Smile,
    badge: 'Oral & Dental',
    accentBg: 'from-brand-500/15 to-sky-400/10 dark:from-brand-500/20 dark:to-sky-400/10',
  },
};

export default function SpecialtyCard({ title, description, count }) {
  const style = specialtyStyles[title] || {
    icon: Stethoscope,
    badge: 'Specialist Care',
    accentBg: 'from-brand-500/15 to-cyan-500/10 dark:from-brand-500/20 dark:to-cyan-500/10',
  };

  const IconComponent = style.icon;

  // Format count display dynamically
  const displayCount = typeof count === 'number'
    ? `${count} Specialist${count === 1 ? '' : 's'}`
    : (count || 'Browse Specialists');

  return (
    <Link
      to={`/doctors?specialization=${encodeURIComponent(title)}`}
      className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-3xl"
    >
      <motion.div
        whileHover={{
          y: -6,
          scale: 1.02,
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
        whileTap={{ scale: 0.98 }}
        className="bg-white dark:bg-[#111B33] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:shadow-brand-500/10 dark:hover:shadow-cyan-950/40 hover:border-brand-400/80 dark:hover:border-cyan-500/60 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between"
      >
        {/* Category Soft Blue Accent Corner Glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.accentBg} rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            {/* Animated Category Icon Container in CareSync Blue */}
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-12 h-12 rounded-2xl bg-brand-50/90 dark:bg-brand-950/60 border border-brand-100/80 dark:border-brand-900/60 text-brand-600 dark:text-cyan-400 group-hover:bg-gradient-to-tr group-hover:from-brand-600 group-hover:to-cyan-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs"
            >
              <IconComponent className="w-6 h-6 transition-transform duration-300" />
            </motion.div>

            {/* CareSync Blue Category Badge */}
            <span className="text-[10px] font-bold text-brand-700 dark:text-cyan-300 bg-brand-50 dark:bg-brand-950/70 px-2.5 py-1 rounded-full border border-brand-100/80 dark:border-brand-900/60">
              {style.badge}
            </span>
          </div>

          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
            {title}
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Card Footer with CareSync blue count and interactive arrow */}
        <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-cyan-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="group-hover:text-brand-700 dark:group-hover:text-cyan-300 transition-colors font-bold">
            {displayCount}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 font-bold text-brand-600 dark:text-cyan-400">
              Explore
            </span>
            <ArrowRight className="w-4 h-4 text-brand-600 dark:text-cyan-400 group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
