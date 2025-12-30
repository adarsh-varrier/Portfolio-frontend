// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      const storedToken = localStorage.getItem('adminToken');
      
      if (storedToken) {
        try {
          const response = await fetch(API_ENDPOINTS.AUTH.ME, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setAdmin(data.admin);
            setToken(storedToken);
          } else {
            // Token is invalid, clear it
            logout();
          }
        } catch (error) {
          console.error('Error loading admin:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadAdmin();
  }, []);

  const login = (token, adminData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setToken(token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};