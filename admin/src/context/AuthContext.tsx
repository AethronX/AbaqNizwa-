import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((res) => setAuthenticated(res.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await api.login(username, password);
      setAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'فشل تسجيل الدخول' };
    }
  };

  const logout = async () => {
    await api.logout().catch(() => {});
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
