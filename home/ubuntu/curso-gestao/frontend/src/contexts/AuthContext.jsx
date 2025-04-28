import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Aqui poderíamos fazer uma requisição para verificar o token
          // Por simplicidade, vamos apenas decodificar o payload do token
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.id,
            role: payload.role
          });
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao fazer login';
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao registrar usuário';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMINISTRADOR'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
