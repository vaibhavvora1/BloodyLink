import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Skeleton from './Skeleton';

const roleDashboardMap = {
  admin: '/admin/dashboard',
  patient: '/patient/dashboard',
  donor: '/donor/dashboard'
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container app-container py-5"><Skeleton type="profile" /></div>;
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
