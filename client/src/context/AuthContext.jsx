import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  const isAuthenticated = !!token;

  async function loadUser() {
    const stored = localStorage.getItem('token');
    if (!stored) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/api/auth/me');
      if (data.success && data.data) {
        setUser(data.data);
        setToken(stored);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function login(apiToken, userData) {
    localStorage.setItem('token', apiToken);
    setToken(apiToken);
    setUser(userData ?? null);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
