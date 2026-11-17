import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleDashboardMap = {
  admin: '/admin/dashboard',
  patient: '/patient/dashboard',
  donor: '/donor/dashboard'
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 min-vh-50">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const adminPath = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/portal-x7k2';
    const redirectPath = location.pathname.startsWith('/admin') ? adminPath : '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const fallbackPath = roleDashboardMap[user?.role] || '/';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
