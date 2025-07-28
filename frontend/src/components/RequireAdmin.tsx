import React from 'react';
import { Navigate } from 'react-router-dom';

const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user && user.role === 'admin';
};

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default RequireAdmin;