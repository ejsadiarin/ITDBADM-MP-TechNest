import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RequireStaff: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn || (userRole !== 'staff' && userRole !== 'admin')) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default RequireStaff;