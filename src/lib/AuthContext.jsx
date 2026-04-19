import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { adminAuthApi } from '@/api/backendClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = useCallback(async () => {
    try {
      setAuthError(null);
      setIsLoadingAuth(true);
      const { user: me } = await adminAuthApi.me();
      setUser(me);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      setIsLoadingAuth(false);
    }
  }, []);

  const logout = async (redirectTo = '/') => {
    try {
      await adminAuthApi.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = redirectTo;
  };

  const login = async ({ email, password }) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const { user: loggedIn } = await adminAuthApi.login({ email, password });
      setUser(loggedIn);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return loggedIn;
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthError({ type: 'login_failed', message: e?.message || 'Login failed' });
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      logout,
      login,
      checkAdminSession
    }}>
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
