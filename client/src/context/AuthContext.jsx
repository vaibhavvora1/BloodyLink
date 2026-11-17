import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { setAccessToken, setOnSessionExpired } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOnSessionExpired(() => {
      setUser(null);
      setAccessToken(null);
    });

    const initAuth = async () => {
      try {
        const res = await api.refresh();
        if (res.success && res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (role, credentials) => {
    const res = await api.login(role, credentials);
    if (res.success && res.data?.accessToken) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (role, data) => {
    const res = await api.register(role, data);
    if (res.success && res.data?.accessToken) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Clear client state even if network call fails
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
