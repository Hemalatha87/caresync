import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-5xl font-black text-slate-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-3">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mb-8">
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
