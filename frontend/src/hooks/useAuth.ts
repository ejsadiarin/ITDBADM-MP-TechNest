import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsLoggedIn(!!token);
    setUserRole(user?.role || null);
    setIsLoading(false); // Set loading to false after checking localStorage
  }, []);

  return { isLoggedIn, userRole, isLoading }; // Return isLoading
};
