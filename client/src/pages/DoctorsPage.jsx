import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { DoctorGridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { doctorAPI } from '../services/api';
import { Search, Filter, SlidersHorizontal, Star, DollarSign, Award, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  // Filters state initialized from searchParams
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  const specialtiesList = [
    'All',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic',
    'General Physician',
    'Gynecologist',
    'Dentist'
  ];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sort,
      };
      if (search) params.search = search;
      if (specialization && specialization !== 'All') params.specialization = specialization;
      if (city) params.city = city;
      if (maxFee) params.maxFee = maxFee;
      if (minRating) params.minRating = minRating;

      const res = await doctorAPI.getAll(params);
      if (res.data.success) {
        setDoctors(res.data.doctors);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }
    } catch (err) {
      console.error('Error loading doctors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, sort, page]);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('All');
    setCity('');
    setMaxFee('');
    setMinRating('');
    setSort('rating');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find & Book Top Doctors</h1>
          <p className="text-slate-500 text-sm mt-1">Discover verified healthcare specialists, compare fees, and book slots instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Filter Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              <form onSubmit={handleApplyFilter} className="space-y-5 text-xs font-semibold text-slate-700">
                {/* Search */}
                <div>
                  <label className="block mb-1.5 text-slate-600">Search Doctor or Clinic</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Doctor name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-600"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block mb-1.5 text-slate-600">Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-600 cursor-pointer"
                  >
                    {specialtiesList.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block mb-1.5 text-slate-600">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Boston, New York..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-600"
                  />
                </div>

                {/* Max Fee */}
                <div>
                  <label className="block mb-1.5 text-slate-600">Max Consultation Fee ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={maxFee}
                    onChange={(e) => setMaxFee(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-600"
                  />
                </div>

                {/* Min Rating */}
                <div>
                  <label className="block mb-1.5 text-slate-600">Min Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-600 cursor-pointer"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Right Doctor Results */}
          <div className="lg:col-span-9">
            
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-700">
                Showing <span className="text-brand-600">{total}</span> Verified Doctors
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="fee-low">Fee: Low to High</option>
                  <option value="fee-high">Fee: High to Low</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
            </div>

            {/* Doctors Grid / Skeleton / Empty State */}
            {loading ? (
              <DoctorGridSkeleton count={6} />
            ) : doctors.length === 0 ? (
              <EmptyState
                title="No doctors match your criteria"
                message="Try resetting your filter parameters or searching for a different specialty."
                action={
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                  >
                    Reset All Filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {doctors.map((doc) => (
                    <DoctorCard key={doc._id} doctor={doc} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-sm font-bold px-4 text-slate-700">
                      Page {page} of {pages}
                    </span>

                    <button
                      disabled={page === pages}
                      onClick={() => setPage(page + 1)}
                      className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 hover:bg-slate-50"
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
