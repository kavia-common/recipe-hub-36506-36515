import { useCallback, useEffect, useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * Exposes authentication utilities and state.
   * Provides:
   * - user: parsed user object or null
   * - token: JWT token or null
   * - isAuthenticated: boolean
   * - login({ token, user })
   * - logout()
   * - requireAuth(navigate): redirect to /login if not authenticated
   */
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      if (token) localStorage.setItem('token', token);
      else localStorage.removeItem('token');
    } catch {
      // ignore
    }
  }, [token]);

  const login = useCallback((payload) => {
    // payload expected: { token, user }
    if (payload?.token) setToken(payload.token);
    if (payload?.user) setUser(payload.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
  }, []);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const requireAuth = useCallback((navigate) => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  }, [isAuthenticated]);

  return { user, token, isAuthenticated, login, logout, requireAuth };
}
