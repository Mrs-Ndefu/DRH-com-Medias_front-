import { createContext, useContext, useState, useCallback } from 'react';
import { api } from 'api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sirh_user')); } catch { return null; }
  });

  const setUser = useCallback((updater) => {
    setUserState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('sirh_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('sirh_token', data.token);
    localStorage.setItem('sirh_user', JSON.stringify(data.user));
    setUserState(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sirh_token');
    localStorage.removeItem('sirh_user');
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
