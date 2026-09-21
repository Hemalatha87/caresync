import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI } from '../../services/api';
import AppointmentCard from '../../components/AppointmentCard';
import EmptyState from '../../components/EmptyState';
import { DashboardSkeleton } from '../../components/LoadingSkeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, CheckCircle2, DollarSign, LogOut, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching doctor appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await appointmentAPI.updateStatus(id, status);
      if (res.data.success) {
        fetchAppointments();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const totalPatients = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const totalEarnings = appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + (a.amount || 0), 0);

  // Recharts Chart Data
  const statusData = [
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: '#0284C7' },
    { name: 'Completed', value: completedCount, color: '#10B981' },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, color: '#EF4444' },
  ];

  const monthlyTrends = [
    { month: 'May', appointments: 12 },
    { month: 'Jun', appointments: 18 },
    { month: 'Jul', appointments: 25 },
    { month: 'Aug', appointments: 32 },
    { month: 'Sep', appointments: appointments.length || 15 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Doctor Portal Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name}. Manage patient visits and schedules.</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl text-xs font-bold transition-colors w-fit flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-[#111B33] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block mb-1">Total Patients</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalPatients}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111B33] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block mb-1">Upcoming Visits</span>
              <p className="text-2xl font-extrabold text-brand-600 dark:text-cyan-400">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111B33] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block mb-1">Completed</span>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111B33] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block mb-1">Total Revenue</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">${totalEarnings}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Recharts Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 bg-white dark:bg-[#111B33] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Patient Consultation Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                  <Bar dataKey="appointments" fill="#0284C7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#111B33] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Status Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Patient Appointment Queue */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Patient Appointment Schedule</h2>

          {loading ? (
            <DashboardSkeleton />
          ) : appointments.length === 0 ? (
            <EmptyState
              title="No Patient Appointments"
              message="You currently have no patient appointments booked."
              icon="calendar"
            />
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  isDoctorView={true}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
