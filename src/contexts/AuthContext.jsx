// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        const result = await AuthService.verifyToken();
        if (result.success) {
          setUser(result.data.user);
        } else {
          AuthService.logout();
        }
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      AuthService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setUser(userData);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};