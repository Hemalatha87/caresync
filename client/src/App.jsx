import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

import { ProtectedRoute, RoleBasedRoute } from './components/ProtectedRoute';

function DashboardRedirect() {
  const { user } = useAuth();
  if (user?.role === 'doctor') return <Navigate to="/dashboard/doctor" replace />;
  if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  return <Navigate to="/dashboard/patient" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:id" element={<DoctorDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/appointments" element={<PatientDashboard />} />
              
              <Route element={<RoleBasedRoute allowedRoles={['patient']} />}>
                <Route path="/dashboard/patient" element={<PatientDashboard />} />
              </Route>

              <Route element={<RoleBasedRoute allowedRoles={['doctor']} />}>
                <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
              </Route>

              <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
