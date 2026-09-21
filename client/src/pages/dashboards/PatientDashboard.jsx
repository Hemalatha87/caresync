import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI } from '../../services/api';
import AppointmentCard from '../../components/AppointmentCard';
import EmptyState from '../../components/EmptyState';
import { DashboardSkeleton } from '../../components/LoadingSkeleton';
import { Calendar, Clock, User, Settings, LogOut, CheckCircle2, AlertCircle, Heart, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentAPI.getAll();
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Error loading patient appointments', err);
    } finally {
      setLoading(false);
    }
  };

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

  const upcomingCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-lg">
                  {user?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm truncate">{user?.name}</h3>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full uppercase">
                    Patient Account
                  </span>
                </div>
              </div>

              <nav className="space-y-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    activeTab === 'overview' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Appointments Overview
                </button>

                <Link
                  to="/doctors"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <Search className="w-4 h-4 text-cyan-600" /> Find a Specialist
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all text-left"
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
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming</span>
                <p className="text-3xl font-extrabold text-brand-600">{upcomingCount}</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
                <p className="text-3xl font-extrabold text-emerald-600">{completedCount}</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cancelled</span>
                <p className="text-3xl font-extrabold text-rose-500">{cancelledCount}</p>
              </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Your Scheduled Appointments</h2>

              {loading ? (
                <DashboardSkeleton />
              ) : appointments.length === 0 ? (
                <EmptyState
                  title="No Appointments Found"
                  message="You currently have no scheduled appointments with CareSync specialists."
                  icon="calendar"
                  action={
                    <Link to="/doctors" className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs">
                      Find a Doctor Now
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
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
