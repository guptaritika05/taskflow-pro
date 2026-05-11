import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on refresh
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    }

    return response.data;
  };

  // REGISTER
  const register = async (name, email, password, role) => {
    const response = await api.post('/api/auth/register', {
      name,
      email,
      password,
      role
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    }

    return response.data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};