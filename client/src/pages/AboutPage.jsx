import React from 'react';
import { Heart, Activity, ShieldCheck, Award, Users, Stethoscope, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            About CareSync
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Connecting Patients with Better Healthcare
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            CareSync was built to bridge the gap between patients needing timely care and top-tier medical specialists through cutting-edge technology and intuitive digital experiences.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">100% Verified Care</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Every doctor on CareSync undergoes thorough credential verification and licensing background checks.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Instant Scheduling</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Eliminate phone queues and waiting rooms with real-time digital slot reservation and instant confirmation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Patient Centered</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Empowering patients with transparent doctor ratings, consultation fee clarity, and appointment history.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
