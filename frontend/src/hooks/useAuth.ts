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
    // No longer need to listen to localStorage changes as session is cookie-based
    // and profile endpoint will validate it.
  }, [syncAuth]);

  return { isLoggedIn, userRole, userId, isLoading, syncAuth };
};
