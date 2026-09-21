import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('caresync_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('caresync_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('caresync_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session check failed, clearing token');
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('caresync_token', res.data.token);
      localStorage.setItem('caresync_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('caresync_token', res.data.token);
      localStorage.setItem('caresync_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('caresync_token');
    localStorage.removeItem('caresync_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role: user?.role || 'guest',
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
