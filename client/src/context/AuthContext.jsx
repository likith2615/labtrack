import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@labtrack.edu', password: 'admin123', name: 'Dr. Arthur Vance', role: 'admin' },
  staff: { email: 'elena.ramos@labtrack.edu', password: 'staff123', name: 'Elena Ramos', role: 'staff' },
  student: { email: 'liam.cooper@student.labtrack.edu', password: 'student123', name: 'Liam Cooper', role: 'student' }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('labtrack_auth_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('labtrack_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify stored JWT session on initial application load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('labtrack_auth_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('labtrack_current_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('[AUTH] Token verification expired or failed. Clearing session.', err);
        localStorage.removeItem('labtrack_auth_token');
        localStorage.removeItem('labtrack_current_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.token && res.user) {
      localStorage.setItem('labtrack_auth_token', res.token);
      localStorage.setItem('labtrack_current_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('labtrack_auth_token');
    localStorage.removeItem('labtrack_current_user');
    setToken(null);
    setUser(null);
  }, []);

  const switchDemoRole = useCallback(async (roleName) => {
    const creds = DEMO_CREDENTIALS[roleName];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  }, [login]);

  const role = user?.role || 'guest';
  const isAuthenticated = Boolean(token && user);
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff' || role === 'admin';
  const isStudent = role === 'student';

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        currentUser: user, // Alias for backward compatibility
        role,
        isAuthenticated,
        isAdmin,
        isStaff,
        isStudent,
        login,
        logout,
        switchDemoRole,
        demoCredentials: DEMO_CREDENTIALS,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
