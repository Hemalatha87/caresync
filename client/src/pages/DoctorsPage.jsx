import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { DoctorGridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { doctorAPI } from '../services/api';
import {
  Search, Filter, SlidersHorizontal, Star, Award, RefreshCw,
  ChevronLeft, ChevronRight, X, MapPin, Calendar, CheckCircle2,
  Video, Stethoscope, User, DollarSign, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SPECIALIZATIONS = [
  'All',
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Dentist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic',
  'Gynecologist',
  'ENT Specialist',
  'Ophthalmologist',
  'Psychiatrist'
];

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search & Filter State
  const [search, setSearch] = useState(searchParams.get('search') || searchParams.get('name') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || searchParams.get('city') || '');
  const [minFee, setMinFee] = useState(searchParams.get('minFee') || '');
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || searchParams.get('minRating') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || 'All');
  const [availability, setAvailability] = useState(searchParams.get('availability') || 'All');
  const [consultationType, setConsultationType] = useState(searchParams.get('consultationType') || 'All');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  const fetchDoctors = useCallback(async (customPage = page) => {
    setLoading(true);
    try {
      const params = {
        page: customPage,
        limit: 9,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (specialization && specialization !== 'All') params.specialization = specialization;
      if (location.trim()) params.location = location.trim();
      if (minFee) params.minFee = minFee;
      if (maxFee) params.maxFee = maxFee;
      if (experience) params.experience = experience;
      if (rating) params.rating = rating;
      if (gender && gender !== 'All') params.gender = gender;
      if (availability && availability !== 'All') params.availability = availability;
      if (consultationType && consultationType !== 'All') params.consultationType = consultationType;
      if (date) params.date = date;

      const res = await doctorAPI.getAll(params);
      if (res.data.success) {
        setDoctors(res.data.doctors || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error('Error loading doctors', err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [search, specialization, location, minFee, maxFee, experience, rating, gender, availability, consultationType, date, sort, page]);

  useEffect(() => {
    fetchDoctors(page);
  }, [sort, page]);

  // Sync URL search params
  const syncParams = () => {
    const p = {};
    if (search.trim()) p.search = search.trim();
    if (specialization && specialization !== 'All') p.specialization = specialization;
    if (location.trim()) p.location = location.trim();
    if (minFee) p.minFee = minFee;
    if (maxFee) p.maxFee = maxFee;
    if (experience) p.experience = experience;
    if (rating) p.rating = rating;
    if (gender && gender !== 'All') p.gender = gender;
    if (availability && availability !== 'All') p.availability = availability;
    if (consultationType && consultationType !== 'All') p.consultationType = consultationType;
    if (date) p.date = date;
    if (sort) p.sort = sort;
    setSearchParams(p);
  };

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    syncParams();
    fetchDoctors(1);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('All');
    setLocation('');
    setMinFee('');
    setMaxFee('');
    setExperience('');
    setRating('');
    setGender('All');
    setAvailability('All');
    setConsultationType('All');
    setDate('');
    setSort('rating');
    setPage(1);
    setSearchParams({});
    // Trigger fresh fetch
    setTimeout(() => {
      doctorAPI.getAll({ page: 1, limit: 9, sort: 'rating' }).then((res) => {
        if (res.data.success) {
          setDoctors(res.data.doctors || []);
          setTotal(res.data.total || 0);
          setPages(res.data.pages || 1);
        }
      });
    }, 50);
  };

  // Active filter chips list
  const activeChips = [];
  if (specialization && specialization !== 'All') {
    activeChips.push({ id: 'specialization', label: specialization, remove: () => setSpecialization('All') });
  }
  if (location.trim()) {
    activeChips.push({ id: 'location', label: location, remove: () => setLocation('') });
  }
  if (minFee || maxFee) {
    activeChips.push({
      id: 'fee',
      label: minFee && maxFee ? `₹${minFee}–₹${maxFee}` : minFee ? `₹${minFee}+` : `Up to ₹${maxFee}`,
      remove: () => { setMinFee(''); setMaxFee(''); }
    });
  }
  if (experience) {
    activeChips.push({ id: 'experience', label: `${experience}+ Yrs Exp`, remove: () => setExperience('') });
  }
  if (rating) {
    activeChips.push({ id: 'rating', label: `${rating}+ Rating`, remove: () => setRating('') });
  }
  if (gender && gender !== 'All') {
    activeChips.push({ id: 'gender', label: `${gender}`, remove: () => setGender('All') });
  }
  if (availability && availability !== 'All') {
    activeChips.push({ id: 'availability', label: availability, remove: () => setAvailability('All') });
  }
  if (consultationType && consultationType !== 'All') {
    activeChips.push({ id: 'consultationType', label: consultationType, remove: () => setConsultationType('All') });
  }
  if (date) {
    activeChips.push({ id: 'date', label: date, remove: () => setDate('') });
  }

  // Trigger search whenever a chip is removed
  const handleRemoveChip = (chip) => {
    chip.remove();
    setTimeout(() => {
      handleApplyFilter();
    }, 20);
  };

  const FilterFormComponent = () => (
    <form onSubmit={handleApplyFilter} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
      {/* 1. Doctor Name Search */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Doctor Name or Keyword</label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Dr. Elena, Dermatologist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* 2. Specialization */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Specialization</label>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec} className="dark:bg-slate-900">{spec}</option>
          ))}
        </select>
      </div>

      {/* 3. Location */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Location / City</label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Tenali, Hyderabad, Guntur..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* 4. Consultation Fee Range */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Consultation Fee (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min (₹)"
            value={minFee}
            onChange={(e) => setMinFee(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
          />
          <input
            type="number"
            placeholder="Max (₹)"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
          />
        </div>
      </div>

      {/* 5. Consultation Type */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Consultation Type</label>
        <select
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          <option value="All" className="dark:bg-slate-900">All Formats</option>
          <option value="In-Clinic" className="dark:bg-slate-900">In-Clinic Consultation</option>
          <option value="Video Consultation" className="dark:bg-slate-900">Video Consultation</option>
          <option value="Both" className="dark:bg-slate-900">In-Clinic & Video (Both)</option>
        </select>
      </div>

      {/* 6. Availability */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Availability</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          <option value="All" className="dark:bg-slate-900">Anytime</option>
          <option value="Available Today" className="dark:bg-slate-900">Available Today</option>
          <option value="Available Tomorrow" className="dark:bg-slate-900">Available Tomorrow</option>
          <option value="Available This Week" className="dark:bg-slate-900">Available This Week</option>
        </select>
      </div>

      {/* 7. Specific Date */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Preferred Date</label>
        <div className="relative">
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
          />
        </div>
      </div>

      {/* 8. Minimum Experience */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Experience</label>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          <option value="" className="dark:bg-slate-900">Any Experience</option>
          <option value="3" className="dark:bg-slate-900">3+ Years</option>
          <option value="5" className="dark:bg-slate-900">5+ Years</option>
          <option value="10" className="dark:bg-slate-900">10+ Years</option>
          <option value="15" className="dark:bg-slate-900">15+ Years</option>
        </select>
      </div>

      {/* 9. Minimum Rating */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Doctor Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          <option value="" className="dark:bg-slate-900">Any Rating</option>
          <option value="4.8" className="dark:bg-slate-900">4.8+ Stars (Top Rated)</option>
          <option value="4.5" className="dark:bg-slate-900">4.5+ Stars</option>
          <option value="4.0" className="dark:bg-slate-900">4.0+ Stars</option>
          <option value="3.5" className="dark:bg-slate-900">3.5+ Stars</option>
        </select>
      </div>

      {/* 10. Doctor Gender */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Doctor Gender</label>
        <div className="grid grid-cols-3 gap-1.5">
          {['All', 'Male', 'Female'].map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setGender(g)}
              className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all ${
                gender === g
                  ? 'bg-brand-600 dark:bg-cyan-600 text-white border-brand-600 dark:border-cyan-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" />
        <span>Search Doctors</span>
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Advanced Medical Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Find & Book Top Doctors</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Discover verified healthcare specialists, compare fees, and book slots instantly.</p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeChips.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Filter Panel (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white dark:bg-[#111B33] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                  <span>Search Filters</span>
                </div>
                {activeChips.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-brand-600 dark:text-cyan-400 hover:text-brand-700 dark:hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>

              <FilterFormComponent />
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileFilterOpen(false)}
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  className="relative z-10 w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#111B33] h-full overflow-y-auto p-6 shadow-2xl space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                      <span>Doctor Filters</span>
                    </div>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterFormComponent />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Right Doctor Results */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Top Toolbar */}
            <div className="bg-white dark:bg-[#111B33] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                Found <span className="text-brand-600 dark:text-cyan-400">{total}</span> Verified Specialist{total === 1 ? '' : 's'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="relevance" className="dark:bg-slate-900">Relevance</option>
                  <option value="rating" className="dark:bg-slate-900">Rating: High to Low</option>
                  <option value="experience" className="dark:bg-slate-900">Experience: High to Low</option>
                  <option value="fee-low" className="dark:bg-slate-900">Consultation Fee: Low to High</option>
                  <option value="fee-high" className="dark:bg-slate-900">Consultation Fee: High to Low</option>
                  <option value="availability" className="dark:bg-slate-900">Earliest Availability</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 py-1">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Active Filters:</span>
                {activeChips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleRemoveChip(chip)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-cyan-400 border border-brand-200 dark:border-brand-900/60 text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors"
                  >
                    <span>{chip.label}</span>
                    <X className="w-3 h-3 text-brand-600 dark:text-cyan-400" />
                  </button>
                ))}
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Doctors Grid / Skeleton / Empty State */}
            {loading ? (
              <DoctorGridSkeleton count={6} />
            ) : doctors.length === 0 ? (
              <EmptyState
                title="No doctors found matching your criteria."
                message="Try adjusting or clearing your filters to discover other healthcare specialists."
                action={
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Clear Filters</span>
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doc) => (
                    <DoctorCard key={doc._id} doctor={doc} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-xs font-bold px-4 text-slate-700 dark:text-slate-200">
                      Page {page} of {pages}
                    </span>

                    <button
                      disabled={page === pages}
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
