import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Pre-load authenticated recruiter user
  const [user, setUser] = useState({
    id: 1,
    name: 'Admin Recruiter',
    email: 'recruiter@example.com',
    role: 'recruiter'
  });
  const [token, setToken] = useState('dummy-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set axios authorization header globally
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  const login = async () => {
    return { success: true };
  };

  const register = async () => {
    return { success: true };
  };

  const logout = () => {
    // In bypassed mode, logout doesn't need to do anything
    console.log('Logout clicked in bypassed mode');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
