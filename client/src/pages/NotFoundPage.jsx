import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 transition-colors duration-300">
      <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">Page Not Found</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-8">
        The requested healthcare page or doctor profile could not be located.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return Home
      </Link>
    </div>
  );
}
