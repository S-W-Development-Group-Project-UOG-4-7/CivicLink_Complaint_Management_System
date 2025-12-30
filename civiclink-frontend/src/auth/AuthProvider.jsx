import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const api = axios.create({ baseURL: '/' });

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(() => {
    const raw = localStorage.getItem('cl_tokens');
    return raw ? JSON.parse(raw) : null;
  });
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('cl_user');
    return raw ? JSON.parse(raw) : null;
  });

  api.interceptors.request.use((config) => {
    if (tokens?.access) config.headers.Authorization = `Bearer ${tokens.access}`;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && tokens?.refresh && !original._retry) {
        original._retry = true;
        try {
          const r = await axios.post('/api/auth/token/refresh/', { refresh: tokens.refresh });
          const newTokens = { access: r.data.access, refresh: tokens.refresh };
          setTokens(newTokens);
          localStorage.setItem('cl_tokens', JSON.stringify(newTokens));
          original.headers.Authorization = `Bearer ${newTokens.access}`;
          return api(original);
        } catch {
          await logout();
        }
      }
      return Promise.reject(error);
    }
  );

  const fetchMe = useCallback(async () => {
    if (!tokens?.access) return null;
    try {
      const { data } = await api.get('/api/me/');
      const role = data.is_officer ? 'officer' : (data.is_citizen ? 'citizen' : 'user');
      const u = { username: data.username, role, officer: data.officer, citizen: data.citizen };
      setUser(u);
      localStorage.setItem('cl_user', JSON.stringify(u));
      return u;
    } catch {
      return null;
    }
  }, [tokens]);

  useEffect(() => {
    if (tokens && !user) fetchMe();
  }, [tokens, user, fetchMe]);

  const login = useCallback(async (username, password) => {
    const { data } = await axios.post('/api/auth/token/', { username, password });
    const t = { access: data.access, refresh: data.refresh };
    setTokens(t);
    localStorage.setItem('cl_tokens', JSON.stringify(t));
    const u = await fetchMe();
    if (!u?.role || u.role !== 'officer') {
      await logout();
      throw new Error('Not authorized as Officer');
    }
  }, [fetchMe]);

  const logout = useCallback(async () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('cl_tokens');
    localStorage.removeItem('cl_user');
  }, []);

  const value = useMemo(() => ({ api, tokens, user, isAuthenticated: !!tokens?.access, login, logout }), [tokens, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
