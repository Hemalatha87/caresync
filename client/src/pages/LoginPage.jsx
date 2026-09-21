import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Activity, Mail, Lock, AlertCircle, Sparkles, UserCheck, Stethoscope, Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.user) {
        if (redirect) {
          navigate(redirect);
        } else if (res.user.role === 'doctor') {
          navigate('/dashboard/doctor');
        } else if (res.user.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/patient');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-[#111B33] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xl dark:shadow-2xl space-y-6"
        >
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-md shadow-brand-600/20">
                <div className="w-full h-full bg-white dark:bg-[#0B1329] rounded-[10px] flex items-center justify-center relative">
                  <Heart className="w-5 h-5 text-brand-600 dark:text-cyan-400 fill-brand-100 dark:fill-cyan-950" />
                  <Activity className="w-3.5 h-3.5 text-cyan-500 absolute -top-0.5 -right-0.5" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Care<span className="text-brand-600 dark:text-cyan-400">Sync</span>
              </span>
            </Link>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to manage your appointments and health records</p>
          </div>

          {/* Preset Quick Login Helper Badges */}
          <div className="bg-slate-50 dark:bg-slate-850/70 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-750 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block text-center">
              ⚡ Quick Demo One-Click Fill
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => handleQuickLogin('patient@caresync.com', 'patient123')}
                className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-700 dark:hover:text-cyan-400 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-1 transition-all"
              >
                <UserCheck className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> Patient
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('doctor@caresync.com', 'doctor123')}
                className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-700 dark:hover:text-cyan-400 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-1 transition-all"
              >
                <Stethoscope className="w-3 h-3 text-brand-600 dark:text-cyan-400" /> Doctor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@caresync.com', 'admin123')}
                className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-700 dark:hover:text-cyan-400 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-1 transition-all"
              >
                <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 focus:ring-1 focus:ring-brand-600 dark:focus:ring-cyan-400"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 focus:ring-1 focus:ring-brand-600 dark:focus:ring-cyan-400"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 dark:text-cyan-400 hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
