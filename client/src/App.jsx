import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import SmoothScroll from './components/common/SmoothScroll';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Landing from './pages/public/Landing';
import BloodAvailability from './pages/public/BloodAvailability';
import DonorHomePage from './pages/public/DonorHomePage';
import NotFoundPage from './pages/public/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorSchedulingPage from './pages/donor/DonorSchedulingPage';
import DonationRequestsPage from './pages/donor/DonationRequestsPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import BloodRequestPage from './pages/patient/BloodRequestPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BloodStock from './pages/admin/BloodStock';

const adminLoginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/portal-x7k2';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="flex-grow-1"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/availability" element={<BloodAvailability />} />
          <Route path="/donors" element={<DonorHomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path={adminLoginPath} element={<AdminLoginPage />} />

          <Route path="/donor/dashboard" element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/schedule" element={<ProtectedRoute allowedRoles={['donor']}><DonorSchedulingPage /></ProtectedRoute>} />
          <Route path="/donor/requests" element={<ProtectedRoute allowedRoles={['donor']}><DonationRequestsPage /></ProtectedRoute>} />

          <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/request" element={<ProtectedRoute allowedRoles={['patient']}><BloodRequestPage /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/blood-stock" element={<ProtectedRoute allowedRoles={['admin']}><BloodStock /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SmoothScroll>
        <BrowserRouter>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <AnimatedRoutes />
            <Footer />
          </div>
          <ToastContainer position="top-right" autoClose={4000} hideProgressBar theme="colored" />
        </BrowserRouter>
      </SmoothScroll>
    </AuthProvider>
  );
}
