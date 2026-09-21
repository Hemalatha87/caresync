import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Shield, Phone, Mail, MapPin, Github, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#070C1A] text-slate-300 pt-16 pb-8 border-t border-slate-800 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-600/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-md shadow-brand-600/30">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center relative">
                  <Heart className="w-5 h-5 text-brand-400 fill-brand-400/20" />
                  <Activity className="w-3.5 h-3.5 text-cyan-400 absolute -top-0.5 -right-0.5" />
                </div>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Care<span className="text-cyan-400">Sync</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              CareSync is a smart healthcare platform designed to connect patients with top-rated medical specialists, streamline appointment scheduling, and deliver exceptional care.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800/80 dark:bg-slate-850 text-cyan-400 border border-slate-700 dark:border-slate-800">
                <Shield className="w-3.5 h-3.5" /> 100% Verified Specialists
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800/80 dark:bg-slate-850 text-brand-400 border border-slate-700 dark:border-slate-800">
                <Phone className="w-3.5 h-3.5" /> 24/7 Support Hotline
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link to="/doctors" className="hover:text-cyan-400 transition-colors">Specialists Directory</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Support</Link></li>
              <li><a href="#careers" className="hover:text-cyan-400 transition-colors">Careers & Hiring</a></li>
            </ul>
          </div>

          {/* Column 3: Medical Specialties */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Specialties</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/doctors?specialization=Cardiologist" className="hover:text-cyan-400 transition-colors">Cardiology</Link></li>
              <li><Link to="/doctors?specialization=Dermatologist" className="hover:text-cyan-400 transition-colors">Dermatology</Link></li>
              <li><Link to="/doctors?specialization=Neurologist" className="hover:text-cyan-400 transition-colors">Neurology</Link></li>
              <li><Link to="/doctors?specialization=Pediatrician" className="hover:text-cyan-400 transition-colors">Pediatrics</Link></li>
              <li><Link to="/doctors?specialization=Orthopedic" className="hover:text-cyan-400 transition-colors">Orthopedics</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">CareSync Hub</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>100 Innovation Parkway, Healthcare Suite 400</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>support@caresync.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+1 (800) 273-SYNC</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="border-slate-800 mb-8" />

        {/* Bottom copyright and social links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareSync Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-slate-800 hover:text-cyan-400 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-slate-800 hover:text-cyan-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-slate-800 hover:text-cyan-400 transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" aria-label="GitHub" className="p-2 rounded-lg bg-slate-800 hover:text-cyan-400 transition-colors"><Github className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
