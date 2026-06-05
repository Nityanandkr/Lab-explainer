import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Client-side fallback credentials for static deploys (Netlify, etc.)
const STATIC_ADMIN_USER = 'labverse_admin';
const STATIC_ADMIN_PASS = 'admin123';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('labverse_token');
    if (token) {
      // Try the live backend first
      axios.get('/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => setIsAdmin(true))
        .catch(() => {
          // Fallback: check client-side session flag
          if (localStorage.getItem('labverse_static_auth') === 'true') {
            setIsAdmin(true);
          } else {
            localStorage.removeItem('labverse_token');
            setIsAdmin(false);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    // Try the live backend first
    try {
      const res = await axios.post('/admin/login', { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem('labverse_token', res.data.token);
        localStorage.removeItem('labverse_static_auth');
        setIsAdmin(true);
        return res.data;
      }
    } catch (err) {
      // If the backend is unreachable (Netlify), fall back to client-side check
      const isNetworkError = !err.response || err.response.status === 404 ||
        (err.response && typeof err.response.data === 'string' && err.response.data.includes('<!'));

      if (isNetworkError) {
        if (username === STATIC_ADMIN_USER && password === STATIC_ADMIN_PASS) {
          localStorage.setItem('labverse_token', 'static_session');
          localStorage.setItem('labverse_static_auth', 'true');
          setIsAdmin(true);
          return { message: 'Login successful (offline mode)' };
        } else {
          throw new Error('Invalid credentials');
        }
      }
      // Real auth error from backend — re-throw
      throw err;
    }
  };

  const logout = async () => {
    await axios.post('/admin/logout').catch(() => {});
    localStorage.removeItem('labverse_token');
    localStorage.removeItem('labverse_static_auth');
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
