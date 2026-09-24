import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

// Helper function to safely decode JWT token without external libraries
export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('Failed to parse JWT payload:', e);
    return null;
  }
};

// Check if JWT token is expired
export const isJwtExpired = (token) => {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return false;
  return decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bistro_token'));
  const [loading, setLoading] = useState(true);

  // Validate and retrieve current user session
  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Check if stored JWT token is already expired
    if (isJwtExpired(token)) {
      console.warn('JWT token has expired, logging out.');
      logout();
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Failed to restore JWT session:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Login action
  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.success && data.token) {
      localStorage.setItem('bistro_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.message || 'Authentication failed');
  };

  // Register action
  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.success && data.token) {
      localStorage.setItem('bistro_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.message || 'Registration failed');
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('bistro_token');
    setToken(null);
    setUser(null);
  };

  // Update profile action
  const updateProfile = async (profileData) => {
    const data = await api.updateProfile(profileData);
    if (data.success && data.user) {
      setUser((prev) => ({ ...prev, ...data.user }));
      return data.user;
    }
    throw new Error(data.message || 'Failed to update profile');
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user && !!token && !isJwtExpired(token);
  const jwtPayload = parseJwt(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        jwtPayload,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: fetchCurrentUser,
        isJwtExpired: () => isJwtExpired(token),
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
