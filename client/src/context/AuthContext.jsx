import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('labverse_token');
    if (token) {
      axios.get('/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => setIsAdmin(true))
        .catch(() => {
          localStorage.removeItem('labverse_token');
          setIsAdmin(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await axios.post('/admin/login', { username, password });
    localStorage.setItem('labverse_token', res.data.token);
    setIsAdmin(true);
    return res.data;
  };

  const logout = async () => {
    await axios.post('/admin/logout').catch(() => {});
    localStorage.removeItem('labverse_token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
