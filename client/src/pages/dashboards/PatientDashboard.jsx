import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI } from '../../services/api';
import AppointmentCard from '../../components/AppointmentCard';
import EmptyState from '../../components/EmptyState';
import { DashboardSkeleton } from '../../components/LoadingSkeleton';
import { Calendar, Clock, User, LogOut, CheckCircle2, AlertCircle, Heart, Search, Filter, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'UPCOMING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentAPI.getAll();
      if (res.data.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (err) {
      console.error('Error loading patient appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await appointmentAPI.cancel(id);
      if (res.data.success) {
        fetchAppointments();
      }
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  const normalizeStatus = (st) => (st || '').toUpperCase();

  // Metrics
  const upcomingAppointments = appointments.filter(a => {
    const s = normalizeStatus(a.status);
    return s === 'CONFIRMED' || s === 'PENDING';
  });
  const completedAppointments = appointments.filter(a => normalizeStatus(a.status) === 'COMPLETED');
  const cancelledAppointments = appointments.filter(a => {
    const s = normalizeStatus(a.status);
    return s === 'CANCELLED' || s === 'REJECTED';
  });

  // Filtered list based on active tab
  const filteredAppointments = appointments.filter(a => {
    const s = normalizeStatus(a.status);
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UPCOMING') return s === 'CONFIRMED' || s === 'PENDING';
    if (activeTab === 'CONFIRMED') return s === 'CONFIRMED';
    if (activeTab === 'COMPLETED') return s === 'COMPLETED';
    if (activeTab === 'CANCELLED') return s === 'CANCELLED' || s === 'REJECTED';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#111B33] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                  {user?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{user?.name || 'Patient'}</h3>
                  <span className="text-[10px] font-bold text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full uppercase">
                    Patient Account
                  </span>
                </div>
              </div>

              <nav className="space-y-1 text-xs font-semibold">
                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Menu
                </div>

                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    activeTab === 'ALL'
                      ? 'bg-brand-600 dark:bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> All Appointments
                </button>

                <Link
                  to="/doctors"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <Search className="w-4 h-4 text-brand-600 dark:text-cyan-400" /> Find & Book Doctors
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('UPCOMING')}
                className={`bg-white dark:bg-[#111B33] rounded-3xl p-6 border transition-all cursor-pointer ${
                  activeTab === 'UPCOMING'
                    ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-1">Upcoming</span>
                <p className="text-3xl font-extrabold text-brand-600 dark:text-cyan-400">{upcomingAppointments.length}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Confirmed & pending visits</span>
              </div>

              <div
                onClick={() => setActiveTab('COMPLETED')}
                className={`bg-white dark:bg-[#111B33] rounded-3xl p-6 border transition-all cursor-pointer ${
                  activeTab === 'COMPLETED'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-1">Completed</span>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedAppointments.length}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Attended consultations</span>
              </div>

              <div
                onClick={() => setActiveTab('CANCELLED')}
                className={`bg-white dark:bg-[#111B33] rounded-3xl p-6 border transition-all cursor-pointer ${
                  activeTab === 'CANCELLED'
                    ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-1">Cancelled</span>
                <p className="text-3xl font-extrabold text-rose-500 dark:text-rose-400">{cancelledAppointments.length}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Cancelled / rejected visits</span>
              </div>
            </div>

            {/* Filter Tabs Bar */}
            <div className="bg-white dark:bg-[#111B33] rounded-2xl p-2 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'All', count: appointments.length },
                  { id: 'UPCOMING', label: 'Upcoming', count: upcomingAppointments.length },
                  { id: 'CONFIRMED', label: 'Confirmed', count: appointments.filter(a => normalizeStatus(a.status) === 'CONFIRMED').length },
                  { id: 'COMPLETED', label: 'Completed', count: completedAppointments.length },
                  { id: 'CANCELLED', label: 'Cancelled', count: cancelledAppointments.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === tab.id
                        ? 'bg-brand-600 dark:bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={fetchAppointments}
                className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors"
                title="Refresh Appointments"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeTab === 'ALL' ? 'All Scheduled Appointments' : `${activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} Appointments`}
                </h2>
                <span className="text-xs text-slate-400 font-semibold">{filteredAppointments.length} appointment{filteredAppointments.length === 1 ? '' : 's'}</span>
              </div>

              {loading ? (
                <DashboardSkeleton />
              ) : filteredAppointments.length === 0 ? (
                <EmptyState
                  title={activeTab === 'ALL' ? 'No Appointments Found' : `No ${activeTab.toLowerCase()} appointments`}
                  message="You have no appointments in this category. Use CareSync to book your next consultation."
                  icon="calendar"
                  action={
                    <Link to="/doctors" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md">
                      Find a Doctor Now
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
