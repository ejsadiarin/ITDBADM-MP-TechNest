import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const user = await response.json();
        setIsLoggedIn(true);
        setUserRole(user?.role || null);
        setUserId(user?.user_id || null);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserId(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setIsLoggedIn(false);
      setUserRole(null);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncAuth();
  }, [syncAuth]);

  const login = useCallback(async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid credentials');
    }

    const user = await response.json();
    setIsLoggedIn(true);
    setUserRole(user.role);
    setUserId(user.user_id);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setUserRole(null);
    setUserId(null);
  }, []);

  return { isLoggedIn, userRole, userId, isLoading, login, logout, syncAuth };
};
