import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireOfficer({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || user?.role !== 'officer') {
    return <Navigate to="/officer/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
