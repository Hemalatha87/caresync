import React, { useState, useEffect } from 'react';
import { adminAPI, doctorAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DashboardSkeleton } from '../../components/LoadingSkeleton';
import { Users, Stethoscope, Calendar, DollarSign, ShieldCheck, CheckCircle2, XCircle, Search, LogOut } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, docRes, userRes] = await Promise.all([
        adminAPI.getStats(),
        doctorAPI.getAll({ limit: 100 }),
        adminAPI.getUsers(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (docRes.data.success) setDoctors(docRes.data.doctors);
      if (userRes.data.success) setUsersList(userRes.data.users);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (docId) => {
    try {
      const res = await adminAPI.toggleDoctorVerification(docId);
      if (res.data.success) {
        setDoctors(doctors.map(d => d._id === docId ? { ...d, isVerified: !d.isVerified } : d));
      }
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const growthData = [
    { month: 'Jan', patients: 120, doctors: 15, appointments: 210 },
    { month: 'Feb', patients: 250, doctors: 28, appointments: 430 },
    { month: 'Mar', patients: 410, doctors: 45, appointments: 780 },
    { month: 'Apr', patients: 620, doctors: 60, appointments: 1100 },
    { month: 'May', patients: 850, doctors: 82, appointments: 1650 },
    { month: 'Current', patients: stats?.totalPatients || 1000, doctors: stats?.totalDoctors || 50, appointments: stats?.totalAppointments || 2500 },
  ];

  const filteredUsers = usersList.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Admin Platform Command Center</h1>
            <p className="text-xs text-slate-500 mt-1">CareSync system telemetry, user controls, and doctor verifications.</p>
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors w-fit flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Top Platform Stats */}
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Total Patients</span>
                  <p className="text-2xl font-extrabold text-slate-900">{stats?.totalPatients || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Verified Doctors</span>
                  <p className="text-2xl font-extrabold text-cyan-600">{stats?.totalDoctors || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Appointments</span>
                  <p className="text-2xl font-extrabold text-emerald-600">{stats?.totalAppointments || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Platform Revenue</span>
                  <p className="text-2xl font-extrabold text-slate-900">${stats?.totalRevenue || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Growth Graph */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Platform User & Booking Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="appointments" stroke="#0284C7" fill="#0284C7" fillOpacity={0.15} name="Appointments" />
                    <Area type="monotone" dataKey="patients" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.1} name="Patients" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Admin Management Section Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              <div className="flex border-b border-slate-100 gap-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                    activeTab === 'overview' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
                  }`}
                >
                  Doctor Verifications ({doctors.length})
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                    activeTab === 'users' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
                  }`}
                >
                  User Directory ({usersList.length})
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 px-2">Doctor</th>
                        <th className="pb-3 px-2">Specialization</th>
                        <th className="pb-3 px-2">Fee</th>
                        <th className="pb-3 px-2">Rating</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {doctors.map(doc => (
                        <tr key={doc._id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-2 font-bold text-slate-900">{doc.name}</td>
                          <td className="py-3 px-2 text-slate-600">{doc.specialization}</td>
                          <td className="py-3 px-2 font-bold text-slate-800">${doc.consultationFee}</td>
                          <td className="py-3 px-2 text-slate-700">★ {doc.rating}</td>
                          <td className="py-3 px-2">
                            {doc.isVerified ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => handleToggleVerify(doc._id)}
                              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                                doc.isVerified
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {doc.isVerified ? 'Revoke' : 'Verify Doctor'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="relative max-w-sm">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-600"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="pb-3 px-2">Name</th>
                          <th className="pb-3 px-2">Email</th>
                          <th className="pb-3 px-2">Role</th>
                          <th className="pb-3 px-2">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(u => (
                          <tr key={u._id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-2 font-bold text-slate-900">{u.name}</td>
                            <td className="py-3 px-2 text-slate-600">{u.email}</td>
                            <td className="py-3 px-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
