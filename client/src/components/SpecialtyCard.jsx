import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Sparkles, Brain, Baby, Bone, Stethoscope, Heart, Smile, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Cardiologist: HeartPulse,
  Dermatologist: Sparkles,
  Neurologist: Brain,
  Pediatrician: Baby,
  Orthopedic: Bone,
  'General Physician': Stethoscope,
  Gynecologist: Heart,
  Dentist: Smile,
};

export default function SpecialtyCard({ title, description, count }) {
  const IconComponent = iconMap[title] || Stethoscope;

  return (
    <Link to={`/doctors?specialization=${encodeURIComponent(title)}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-100/60 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          <IconComponent className="w-6 h-6" />
        </div>

        <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
          {title}
        </h4>

        <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between text-xs font-semibold text-brand-600">
          <span>{count || '12+'} Specialists</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  );
}
