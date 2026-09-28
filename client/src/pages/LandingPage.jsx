import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroScene from '../components/3D/HeroScene';
import DoctorCard from '../components/DoctorCard';
import SpecialtyCard from '../components/SpecialtyCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { doctorAPI } from '../services/api';
import {
  Search, MapPin, Calendar, ShieldCheck, Award, Clock, ArrowRight,
  UserCheck, CheckCircle2, Star, Users, Stethoscope, Heart, Activity,
  ChevronRight, Sparkles, Building2, PhoneCall, Baby, UserRound, Accessibility
} from 'lucide-react';
import { motion } from 'framer-motion';

const AGE_GROUPS_META = [
  {
    id: 'kids',
    emoji: '👶',
    title: 'Kids Care',
    ageRange: '0–17 Years',
    description: 'Find doctors experienced in caring for children and young patients.',
    buttonText: 'Find Kids Doctors',
    link: '/doctors?ageGroup=kids',
    icon: Baby,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    alt: 'Children healthcare consultation',
    badge: 'Pediatric Care',
  },
  {
    id: 'adults',
    emoji: '🧑',
    title: 'Adult Care',
    ageRange: '18–59 Years',
    description: 'Find doctors for routine consultations, ongoing care and adult healthcare needs.',
    buttonText: 'Find Adult Doctors',
    link: '/doctors?ageGroup=adults',
    icon: UserRound,
    image: 'https://images.unsplash.com/photo-1622256040718-f39423ff2b0c?auto=format&fit=crop&q=80&w=800',
    alt: 'Adult healthcare consultation',
    badge: 'Adult Health',
  },
  {
    id: 'seniors',
    emoji: '👴',
    title: 'Senior Care',
    ageRange: '60+ Years',
    description: 'Find doctors who provide healthcare support for older adults and their needs.',
    buttonText: 'Find Senior Doctors',
    link: '/doctors?ageGroup=seniors',
    icon: Accessibility,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
    alt: 'Senior healthcare consultation',
    badge: 'Geriatric Care',
  },
];

const SPECIALTY_META = [
  { title: 'General Physician', description: 'Comprehensive health checkups, preventative medicine & diagnosis.' },
  { title: 'Cardiologist', description: 'Expert heart health care, blood pressure management & ECG analysis.' },
  { title: 'Dermatologist', description: 'Advanced skin treatments, acne care, laser therapy & aesthetic skin care.' },
  { title: 'Pediatrician', description: 'Specialized healthcare, immunization & growth monitoring for kids.' },
  { title: 'Neurologist', description: 'Comprehensive brain, spinal cord & nervous system disease care.' },
  { title: 'Orthopedic', description: 'Joint pain relief, fracture management & sports injury rehabilitation.' },
  { title: 'Gynecologist', description: 'Womens wellness, prenatal guidance & reproductive health care.' },
  { title: 'Dentist', description: 'Painless cosmetic dentistry, whitening, implants & oral hygiene.' },
];

export default function LandingPage() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [specialtyCounts, setSpecialtyCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorsAndCounts = async () => {
      try {
        const [docsRes, countsRes] = await Promise.allSettled([
          doctorAPI.getAll({ limit: 6, sort: 'rating' }),
          doctorAPI.getSpecializationCounts(),
        ]);

        if (docsRes.status === 'fulfilled' && docsRes.value.data.success) {
          setFeaturedDoctors(docsRes.value.data.doctors);
        }
        if (countsRes.status === 'fulfilled' && countsRes.value.data.success) {
          setSpecialtyCounts(countsRes.value.data.counts || {});
        }
      } catch (err) {
        console.warn('Failed to load landing data', err);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDoctorsAndCounts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedSpecialty !== 'All') params.append('specialization', selectedSpecialty);
    navigate(`/doctors?${params.toString()}`);
  };

  const steps = [
    { num: '01', title: 'Search Specialists', desc: 'Browse verified doctors across Andhra Pradesh & Telangana by specialty, location, or fee.', icon: Search },
    { num: '02', title: 'Select Time Slot', desc: 'Choose a convenient date and available hour slot that fits your schedule.', icon: Calendar },
    { num: '03', title: 'Instant Booking', desc: 'Confirm appointment with zero hassle and instant digital confirmation.', icon: CheckCircle2 },
    { num: '04', title: 'Meet Your Doctor', desc: 'Visit the clinic or consult with top-rated medical experts via HD video.', icon: UserCheck },
  ];

  const stats = [
    { count: '10K+', label: 'Registered Patients' },
    { count: '500+', label: 'Verified Doctors' },
    { count: '25K+', label: 'Appointments Booked' },
    { count: '20+', label: 'Specialized Fields' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground />

      {/* 1. HERO SECTION WITH 3D EXPERIENCE */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-brand-50/60 dark:from-brand-950/20 via-white/80 dark:via-[#080E1E] to-slate-50 dark:to-[#080E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/80 dark:border-cyan-800/80 text-cyan-800 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Smart Healthcare Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Healthcare Made <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-cyan-500 to-cyan-400">Simple</span> & Accessible.
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Find trusted doctors across Andhra Pradesh & Telangana, compare verified profiles, and book appointments effortlessly.
              </p>

              {/* Quick Doctor Search Box */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white dark:bg-[#111B33] p-3 rounded-2xl sm:rounded-3xl shadow-xl shadow-brand-900/5 dark:shadow-2xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 max-w-2xl"
              >
                <div className="sm:col-span-6 flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                  <Search className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Doctor name, city, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                  <Stethoscope className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="dark:bg-slate-900">All Specialties</option>
                    {SPECIALTY_META.map(s => (
                      <option key={s.title} value={s.title} className="dark:bg-slate-900">{s.title}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="sm:col-span-2 w-full py-3 bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1"
                >
                  Find
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Verified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                  <span>4.9 Star Rated Care</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
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

      {/* 2. TOP SPECIALIZATIONS SECTION WITH HEALTHCARE ANIMATED BACKGROUND */}
      <section className="py-20 relative bg-white dark:bg-[#0B1329] border-y border-slate-100 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden">
        {/* Healthcare Subtle Ambient Glows & Grid */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c705_1px,transparent_1px),linear-gradient(to_bottom,#0284c705_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#38bdf804_1px,transparent_1px),linear-gradient(to_bottom,#38bdf804_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 border border-brand-100 dark:border-brand-900/60">
              <Activity className="w-3.5 h-3.5" />
              Explore Medical Fields
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Top Specializations
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Connect with experienced healthcare experts across specialized disciplines in Andhra Pradesh and Telangana.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIALTY_META.map((spec, i) => {
              const countValue = specialtyCounts[spec.title] ?? 0;
              return (
                <motion.div
                  key={spec.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <SpecialtyCard
                    title={spec.title}
                    description={spec.description}
                    count={countValue}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2.5 AGE-GROUP BASED HEALTHCARE DISCOVERY SECTION */}
      <section className="py-20 relative bg-gradient-to-b from-slate-50 via-brand-50/30 to-slate-50 dark:from-[#080E1E] dark:via-[#0c1630] dark:to-[#080E1E] transition-colors duration-300 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3 border border-cyan-100 dark:border-cyan-900/60">
              <Users className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Specialized Care By Stage
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Find Care for Every Age
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 font-medium">
              Connect with the right healthcare professionals for every stage of life.
            </p>
          </motion.div>

          {/* 3 Age Group Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AGE_GROUPS_META.map((group, idx) => {
              const IconComp = group.icon;
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="bg-white dark:bg-[#111B33] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-brand-900/5 dark:shadow-2xl hover:border-brand-300 dark:hover:border-cyan-500/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
                >
                  {/* Subtle top-right ambient glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-brand-500/10 dark:from-cyan-500/10 via-transparent to-transparent rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                  <div>
                    {/* Category Image with subtle blue overlay */}
                    <div className="relative mb-5 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-850 aspect-[16/10]">
                      <img
                        src={group.image}
                        alt={group.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Natural subtle blue gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/45 via-brand-950/10 to-transparent pointer-events-none" />

                      {/* Top Age Range Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shadow-xs border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center gap-1.5">
                        <span>{group.emoji}</span>
                        <span>{group.ageRange}</span>
                      </div>

                      {/* Bottom Category Tag */}
                      <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-brand-600/90 dark:bg-cyan-600/90 text-white backdrop-blur-md text-[11px] font-bold shadow-xs">
                        {group.badge}
                      </div>
                    </div>

                    {/* Card Title & Icon */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-cyan-400 flex items-center justify-center border border-brand-100 dark:border-brand-900/60 group-hover:scale-110 transition-transform shrink-0 shadow-xs">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors">
                          {group.title}
                        </h3>
                        <span className="text-[11px] font-semibold text-brand-600 dark:text-cyan-400">
                          {group.ageRange}
                        </span>
                      </div>
                    </div>

                    {/* Card Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
                      {group.description}
                    </p>
                  </div>

                  {/* Action CTA Button */}
                  <Link
                    to={group.link}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-50 to-cyan-50 dark:from-brand-950/60 dark:to-cyan-950/60 hover:from-brand-600 hover:to-cyan-600 dark:hover:from-brand-600 dark:hover:to-cyan-600 text-brand-700 dark:text-cyan-300 hover:text-white dark:hover:text-white border border-brand-200/80 dark:border-cyan-800/60 hover:border-transparent font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs group/btn"
                  >
                    <span>{group.buttonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DOCTORS SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-[#080E1E] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-cyan-400 mb-2">Top Medical Talent</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Featured Doctors</p>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-cyan-400 hover:text-brand-700 dark:hover:text-cyan-300 group"
            >
              Browse All Doctors <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingDocs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white dark:bg-slate-800 rounded-3xl animate-pulse" />)}
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
      <section className="py-20 bg-white dark:bg-[#0B1329] border-y border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-cyan-400 mb-2">Seamless Process</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">How CareSync Works</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Four easy steps to get the medical care you deserve.</p>
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
                  className="bg-slate-50 dark:bg-[#111B33] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 relative group hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-4xl font-black text-brand-200 dark:text-slate-700/60 absolute top-6 right-6 font-mono">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 dark:bg-cyan-600 text-white flex items-center justify-center mb-6 shadow-md shadow-brand-600/20 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. STATISTICS */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 dark:from-[#080E1E] dark:via-[#0B1329] dark:to-[#080E1E] text-white border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="space-y-1"
              >
                <p className="text-3xl sm:text-5xl font-black text-cyan-400 font-sans tracking-tight">{s.count}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-300 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-20 bg-slate-50 dark:bg-[#080E1E] transition-colors duration-300">
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
