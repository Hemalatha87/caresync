import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroScene from '../components/3D/HeroScene';
import DoctorCard from '../components/DoctorCard';
import SpecialtyCard from '../components/SpecialtyCard';
import { doctorAPI } from '../services/api';
import {
  Search, MapPin, Calendar, ShieldCheck, Award, Clock, ArrowRight,
  UserCheck, CheckCircle2, Star, Users, Stethoscope, Heart, Activity,
  ChevronRight, Sparkles, Building2, PhoneCall
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorAPI.getAll({ limit: 6, sort: 'rating' });
        if (res.data.success) {
          setFeaturedDoctors(res.data.doctors);
        }
      } catch (err) {
        console.warn('Failed to load featured doctors', err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedSpecialty !== 'All') params.append('specialization', selectedSpecialty);
    navigate(`/doctors?${params.toString()}`);
  };

  const specializations = [
    { title: 'General Physician', description: 'Comprehensive health checkups, preventative medicine & diagnosis.', count: '45+' },
    { title: 'Cardiologist', description: 'Expert heart health care, blood pressure management & ECG analysis.', count: '28+' },
    { title: 'Dermatologist', description: 'Advanced skin treatments, acne care, laser therapy & aesthetic skin care.', count: '32+' },
    { title: 'Pediatrician', description: 'Specialized healthcare, immunization & growth monitoring for kids.', count: '24+' },
    { title: 'Neurologist', description: 'Comprehensive brain, spinal cord & nervous system disease care.', count: '18+' },
    { title: 'Orthopedic', description: 'Joint pain relief, fracture management & sports injury rehabilitation.', count: '30+' },
    { title: 'Gynecologist', description: 'Womens wellness, prenatal guidance & reproductive health care.', count: '22+' },
    { title: 'Dentist', description: 'Painless cosmetic dentistry, whitening, implants & oral hygiene.', count: '36+' },
  ];

  const steps = [
    { num: '01', title: 'Search Specialists', desc: 'Browse verified doctors by specialty, location, experience, or ratings.', icon: Search },
    { num: '02', title: 'Select Time Slot', desc: 'Choose a convenient date and available hour slot that fits your schedule.', icon: Calendar },
    { num: '03', title: 'Instant Booking', desc: 'Confirm appointment with zero hassle and instant digital confirmation.', icon: CheckCircle2 },
    { num: '04', title: 'Meet Your Doctor', desc: 'Visit the clinic or consult with top-rated medical experts.', icon: UserCheck },
  ];

  const stats = [
    { count: '10K+', label: 'Registered Patients' },
    { count: '500+', label: 'Verified Doctors' },
    { count: '25K+', label: 'Appointments Booked' },
    { count: '20+', label: 'Specialized Fields' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. HERO SECTION WITH 3D EXPERIENCE */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-brand-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                Smart Healthcare Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Healthcare Made <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">Simple</span> & Accessible.
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Find trusted doctors, discover the right specialists, and book appointments effortlessly with CareSync.
              </p>

              {/* Quick Doctor Search Box */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-3 rounded-2xl sm:rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-2 max-w-2xl"
              >
                <div className="sm:col-span-6 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl">
                  <Search className="w-4 h-4 text-brand-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="Doctor name or condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                  <Stethoscope className="w-4 h-4 text-cyan-600 shrink-0" />
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Specialties</option>
                    {specializations.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                  </select>
                </div>

                <button
                  type="submit"
                  className="sm:col-span-2 w-full py-3 bg-gradient-to-r from-brand-600 to-cyan-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1"
                >
                  Find
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Verified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span>4.9 Star Rated Care</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span>Instant Slot Booking</span>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive 3D Hero Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <HeroScene />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. SPECIALIZATIONS SECTION */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">Explore Medical Fields</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Top Specializations</p>
            <p className="text-slate-500 text-sm mt-2">Connect with experienced healthcare experts across specialized disciplines.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specializations.map((spec, i) => (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <SpecialtyCard {...spec} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DOCTORS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">Top Medical Talent</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Featured Doctors</p>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 group"
            >
              Browse All Doctors <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingDocs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDoctors.map(doctor => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">Seamless Process</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How CareSync Works</p>
            <p className="text-slate-500 text-sm mt-2">Four easy steps to get the medical care you deserve.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 relative"
                >
                  <span className="text-4xl font-black text-brand-200 absolute top-6 right-6 font-mono">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mb-6 shadow-md shadow-brand-600/20">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. STATISTICS */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl sm:text-5xl font-black text-cyan-400 font-sans tracking-tight">{s.count}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-300 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-cyan-600 rounded-3xl p-10 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">Ready to Take Control of Your Health?</h2>
            <p className="text-brand-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of satisfied patients who rely on CareSync for seamless healthcare appointment scheduling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/doctors"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand-700 hover:bg-brand-50 text-sm font-bold rounded-2xl shadow-lg transition-all"
              >
                Find a Doctor Now
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-800/60 hover:bg-brand-800 text-white text-sm font-bold rounded-2xl border border-white/20 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
