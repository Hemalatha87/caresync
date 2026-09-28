import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

const POPULAR_LOCATIONS = [
  'Guntur',
  'Vijayawada',
  'Tenali',
  'Hyderabad',
  'Warangal',
  'Visakhapatnam',
  'Tirupati',
  'Amaravati'
];

const AGE_GROUP_OPTIONS = [
  { value: 'All', label: 'All Age Groups', emoji: '👥' },
  { value: 'kids', label: 'Kids Care (0–17)', emoji: '👶' },
  { value: 'adults', label: 'Adult Care (18–59)', emoji: '🧑' },
  { value: 'seniors', label: 'Senior Care (60+)', emoji: '👴' },
];

// Standalone FilterForm declared OUTSIDE to ensure stable component identity and prevent unmounting
function FilterForm({
  idPrefix = 'desktop',
  search,
  setSearch,
  ageGroup,
  setAgeGroup,
  specialization,
  setSpecialization,
  location,
  setLocation,
  minFee,
  setMinFee,
  maxFee,
  setMaxFee,
  experience,
  setExperience,
  rating,
  setRating,
  gender,
  setGender,
  availability,
  setAvailability,
  consultationType,
  setConsultationType,
  date,
  setDate,
  onApply,
}) {
  return (
    <form onSubmit={onApply} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
      {/* 1. Doctor Name / Keyword Search */}
      <div>
        <label htmlFor={`${idPrefix}-doctor-search-input`} className="block mb-1.5 text-slate-600 dark:text-slate-400">
          Doctor Name or Keyword
        </label>
        <div className="relative">
          <input
            id={`${idPrefix}-doctor-search-input`}
            type="text"
            placeholder="e.g. Dr. Elena, Dermatologist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 focus:ring-1 focus:ring-brand-600/30 dark:focus:ring-cyan-400/30 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* 2. Patient Age Group Discovery Filter */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <span>Patient Age Group</span>
          <span className="text-[10px] text-brand-600 dark:text-cyan-400 font-bold uppercase">Discovery</span>
        </label>
        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          {AGE_GROUP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-white">
              {opt.emoji} {opt.label}
            </option>
          ))}
        </select>

        {/* Quick Age Group Selection Chips */}
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          {AGE_GROUP_OPTIONS.filter((o) => o.value !== 'All').map((opt) => {
            const isSelected = ageGroup.toLowerCase() === opt.value.toLowerCase();
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => setAgeGroup(isSelected ? 'All' : opt.value)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-brand-600 dark:bg-cyan-600 text-white border-brand-600 dark:border-cyan-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.value === 'kids' ? 'Kids' : opt.value === 'adults' ? 'Adults' : 'Seniors'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Specialization */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Specialization</label>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec} className="dark:bg-slate-900 dark:text-white">
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Location / City */}
      <div>
        <label htmlFor={`${idPrefix}-doctor-location-input`} className="block mb-1.5 text-slate-600 dark:text-slate-400">
          Location / City (AP & Telangana)
        </label>
        <div className="relative">
          <input
            id={`${idPrefix}-doctor-location-input`}
            type="text"
            placeholder="e.g. Guntur, Vijayawada, Hyderabad..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 focus:ring-1 focus:ring-brand-600/30 dark:focus:ring-cyan-400/30 transition-all"
          />
          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Quick location suggestion pills */}
        <div className="flex flex-wrap gap-1 mt-2">
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              type="button"
              key={loc}
              onClick={() => setLocation(location.toLowerCase() === loc.toLowerCase() ? '' : loc)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                location.toLowerCase() === loc.toLowerCase()
                  ? 'bg-brand-600 text-white dark:bg-cyan-500 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {loc}
            </button>
          ))}
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
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
          />
          <input
            type="number"
            placeholder="Max (₹)"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
          />
        </div>
      </div>

      {/* 5. Consultation Type */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Consultation Format</label>
        <select
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          <option value="All" className="dark:bg-slate-900 dark:text-white">All Formats</option>
          <option value="In-Clinic" className="dark:bg-slate-900 dark:text-white">In-Clinic Visit</option>
          <option value="Video Consultation" className="dark:bg-slate-900 dark:text-white">HD Video Consultation</option>
          <option value="Both" className="dark:bg-slate-900 dark:text-white">Both In-Clinic & Video</option>
        </select>
      </div>

      {/* 6. Availability */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Availability</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          <option value="All" className="dark:bg-slate-900 dark:text-white">Anytime</option>
          <option value="Available Today" className="dark:bg-slate-900 dark:text-white">Available Today</option>
          <option value="Available Tomorrow" className="dark:bg-slate-900 dark:text-white">Available Tomorrow</option>
        </select>
      </div>

      {/* 7. Preferred Date */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Specific Date</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
        />
      </div>

      {/* 8. Minimum Experience */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Experience Level</label>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          <option value="" className="dark:bg-slate-900 dark:text-white">Any Experience</option>
          <option value="5" className="dark:bg-slate-900 dark:text-white">5+ Years</option>
          <option value="10" className="dark:bg-slate-900 dark:text-white">10+ Years</option>
          <option value="15" className="dark:bg-slate-900 dark:text-white">15+ Years</option>
        </select>
      </div>

      {/* 9. Minimum Rating */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Minimum Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
        >
          <option value="" className="dark:bg-slate-900 dark:text-white">Any Rating</option>
          <option value="4.5" className="dark:bg-slate-900 dark:text-white">★ 4.5 & above</option>
          <option value="4.8" className="dark:bg-slate-900 dark:text-white">★ 4.8 & above</option>
        </select>
      </div>

      {/* 10. Gender */}
      <div>
        <label className="block mb-1.5 text-slate-600 dark:text-slate-400">Doctor Gender</label>
        <div className="grid grid-cols-3 gap-1.5">
          {['All', 'Female', 'Male'].map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setGender(g)}
              className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                gender === g
                  ? 'bg-brand-600 dark:bg-cyan-600 text-white border-brand-600 dark:border-cyan-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
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
        <span>Apply Filters</span>
      </button>
    </form>
  );
}

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search & Filter State - initialized from searchParams
  const [search, setSearch] = useState(searchParams.get('search') || searchParams.get('name') || '');
  const [ageGroup, setAgeGroup] = useState(searchParams.get('ageGroup') || 'All');
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

  // Debounced search term for continuous live typing without cursor jump or remounting
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedLocation, setDebouncedLocation] = useState(location);

  // Sync external search params changes (e.g. from Home page links)
  useEffect(() => {
    const urlAge = searchParams.get('ageGroup');
    if (urlAge && urlAge !== ageGroup) {
      setAgeGroup(urlAge);
    }
    const urlSpec = searchParams.get('specialization');
    if (urlSpec && urlSpec !== specialization) {
      setSpecialization(urlSpec);
    }
  }, [searchParams]);

  // Debounce search and location inputs by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(location);
    }, 350);
    return () => clearTimeout(handler);
  }, [location]);

  // Fetch doctors from backend with real MongoDB query params
  const fetchDoctors = useCallback(async (targetPage = page) => {
    setLoading(true);
    try {
      const params = {
        page: targetPage,
        limit: 9,
        sort,
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (ageGroup && ageGroup !== 'All') params.ageGroup = ageGroup;
      if (specialization && specialization !== 'All') params.specialization = specialization;
      if (debouncedLocation.trim()) params.location = debouncedLocation.trim();
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
  }, [debouncedSearch, ageGroup, specialization, debouncedLocation, minFee, maxFee, experience, rating, gender, availability, consultationType, date, sort, page]);

  // Sync params to URL non-destructively
  useEffect(() => {
    const p = {};
    if (debouncedSearch.trim()) p.search = debouncedSearch.trim();
    if (ageGroup && ageGroup !== 'All') p.ageGroup = ageGroup;
    if (specialization && specialization !== 'All') p.specialization = specialization;
    if (debouncedLocation.trim()) p.location = debouncedLocation.trim();
    if (minFee) p.minFee = minFee;
    if (maxFee) p.maxFee = maxFee;
    if (experience) p.experience = experience;
    if (rating) p.rating = rating;
    if (gender && gender !== 'All') p.gender = gender;
    if (availability && availability !== 'All') p.availability = availability;
    if (consultationType && consultationType !== 'All') p.consultationType = consultationType;
    if (date) p.date = date;
    if (sort) p.sort = sort;
    setSearchParams(p, { replace: true });
  }, [debouncedSearch, ageGroup, specialization, debouncedLocation, minFee, maxFee, experience, rating, gender, availability, consultationType, date, sort, setSearchParams]);

  // Fetch when filters or page change
  useEffect(() => {
    fetchDoctors(page);
  }, [fetchDoctors, page, sort]);

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    setDebouncedSearch(search);
    setDebouncedLocation(location);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setAgeGroup('All');
    setSpecialization('All');
    setLocation('');
    setDebouncedLocation('');
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
    setSearchParams({}, { replace: true });
  };

  // Active filter chips list
  const activeChips = useMemo(() => {
    const chips = [];
    if (search.trim()) {
      chips.push({ id: 'search', label: `Keyword: "${search}"`, remove: () => { setSearch(''); setDebouncedSearch(''); } });
    }
    if (ageGroup && ageGroup !== 'All') {
      const ageLabel = ageGroup === 'kids' ? 'Kids (0–17)' : ageGroup === 'adults' ? 'Adults (18–59)' : 'Seniors (60+)';
      chips.push({ id: 'ageGroup', label: `Age Group: ${ageLabel}`, remove: () => setAgeGroup('All') });
    }
    if (specialization && specialization !== 'All') {
      chips.push({ id: 'specialization', label: specialization, remove: () => setSpecialization('All') });
    }
    if (location.trim()) {
      chips.push({ id: 'location', label: location, remove: () => { setLocation(''); setDebouncedLocation(''); } });
    }
    if (minFee || maxFee) {
      chips.push({
        id: 'fee',
        label: minFee && maxFee ? `₹${minFee}–₹${maxFee}` : minFee ? `₹${minFee}+` : `Up to ₹${maxFee}`,
        remove: () => { setMinFee(''); setMaxFee(''); }
      });
    }
    if (experience) {
      chips.push({ id: 'experience', label: `${experience}+ Yrs Exp`, remove: () => setExperience('') });
    }
    if (rating) {
      chips.push({ id: 'rating', label: `${rating}+ Rating`, remove: () => setRating('') });
    }
    if (gender && gender !== 'All') {
      chips.push({ id: 'gender', label: `Gender: ${gender}`, remove: () => setGender('All') });
    }
    if (availability && availability !== 'All') {
      chips.push({ id: 'availability', label: availability, remove: () => setAvailability('All') });
    }
    if (consultationType && consultationType !== 'All') {
      chips.push({ id: 'consultationType', label: consultationType, remove: () => setConsultationType('All') });
    }
    if (date) {
      chips.push({ id: 'date', label: date, remove: () => setDate('') });
    }
    return chips;
  }, [search, ageGroup, specialization, location, minFee, maxFee, experience, rating, gender, availability, consultationType, date]);

  const handleRemoveChip = (chip) => {
    chip.remove();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Andhra Pradesh & Telangana Medical Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Find & Book Top Doctors</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Discover verified healthcare specialists in Guntur, Vijayawada, Hyderabad, Tenali and more.</p>
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
            <div className="bg-white dark:bg-[#111B33] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
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

              <FilterForm
                idPrefix="desktop"
                search={search}
                setSearch={setSearch}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
                specialization={specialization}
                setSpecialization={setSpecialization}
                location={location}
                setLocation={setLocation}
                minFee={minFee}
                setMinFee={setMinFee}
                maxFee={maxFee}
                setMaxFee={setMaxFee}
                experience={experience}
                setExperience={setExperience}
                rating={rating}
                setRating={setRating}
                gender={gender}
                setGender={setGender}
                availability={availability}
                setAvailability={setAvailability}
                consultationType={consultationType}
                setConsultationType={setConsultationType}
                date={date}
                setDate={setDate}
                onApply={handleApplyFilter}
              />
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
                  <FilterForm
                    idPrefix="mobile"
                    search={search}
                    setSearch={setSearch}
                    ageGroup={ageGroup}
                    setAgeGroup={setAgeGroup}
                    specialization={specialization}
                    setSpecialization={setSpecialization}
                    location={location}
                    setLocation={setLocation}
                    minFee={minFee}
                    setMinFee={setMinFee}
                    maxFee={maxFee}
                    setMaxFee={setMaxFee}
                    experience={experience}
                    setExperience={setExperience}
                    rating={rating}
                    setRating={setRating}
                    gender={gender}
                    setGender={setGender}
                    availability={availability}
                    setAvailability={setAvailability}
                    consultationType={consultationType}
                    setConsultationType={setConsultationType}
                    date={date}
                    setDate={setDate}
                    onApply={handleApplyFilter}
                  />
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
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="relevance" className="dark:bg-slate-900 dark:text-white">Relevance</option>
                  <option value="rating" className="dark:bg-slate-900 dark:text-white">Rating: High to Low</option>
                  <option value="experience" className="dark:bg-slate-900 dark:text-white">Experience: High to Low</option>
                  <option value="fee-low" className="dark:bg-slate-900 dark:text-white">Consultation Fee: Low to High</option>
                  <option value="fee-high" className="dark:bg-slate-900 dark:text-white">Consultation Fee: High to Low</option>
                  <option value="availability" className="dark:bg-slate-900 dark:text-white">Earliest Availability</option>
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
                message="Try adjusting or clearing your location/specialty filters to discover other healthcare specialists."
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
