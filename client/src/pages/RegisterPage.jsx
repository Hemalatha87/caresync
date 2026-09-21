import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Activity, Mail, Lock, User, Phone, Stethoscope, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Doctor optional fields
  const [specialization, setSpecialization] = useState('General Physician');
  const [qualification, setQualification] = useState('MBBS, MD');
  const [consultationFee, setConsultationFee] = useState(100);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role,
        ...(role === 'doctor' && { specialization, qualification, consultationFee }),
      };

      const res = await register(payload);
      if (res && res.user) {
        if (res.user.role === 'doctor') {
          navigate('/dashboard/doctor');
        } else {
          navigate('/dashboard/patient');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 flex items-center justify-center relative overflow-hidden">
      <div className="max-w-md w-full px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6"
        >
          {/* Logo */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative">
                  <Heart className="w-5 h-5 text-brand-600 fill-brand-100" />
                  <Activity className="w-3.5 h-3.5 text-cyan-500 absolute -top-0.5 -right-0.5" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Care<span className="text-brand-600">Sync</span>
              </span>
            </Link>
            <h2 className="text-xl font-bold text-slate-900">Create Your Account</h2>
            <p className="text-xs text-slate-500">Join CareSync to book appointments or manage patient visits</p>
          </div>

          {/* Role Picker */}
          <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'patient' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              I am a Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'doctor' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              I am a Doctor
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-600"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-600"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Extra Fields for Doctor */}
            {role === 'doctor' && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-600 cursor-pointer"
                  >
                    <option value="General Physician">General Physician</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dentist">Dentist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg transition-all"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-medium">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
