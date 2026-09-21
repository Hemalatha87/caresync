import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Contact Support & Clinical Desk</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Have a question or need assistance with your booking? Our team is available 24/7.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white dark:bg-[#111B33] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          
          <div className="md:col-span-5 bg-gradient-to-br from-brand-600 via-brand-700 to-cyan-700 rounded-2xl p-8 text-white space-y-6">
            <h3 className="text-2xl font-bold">Get In Touch</h3>
            <p className="text-brand-100 text-xs leading-relaxed">
              We respond to all patient and healthcare provider inquiries within 1 hour.
            </p>

            <div className="space-y-4 pt-4 text-xs font-medium">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-cyan-300 shrink-0" />
                <span>100 Innovation Parkway, Suite 400</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-300 shrink-0" />
                <span>support@caresync.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-300 shrink-0" />
                <span>+1 (800) 273-SYNC</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Message Received!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Thank you for contacting CareSync. A member of our team will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
