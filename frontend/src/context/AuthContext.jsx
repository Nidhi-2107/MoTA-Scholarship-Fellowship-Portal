import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

const OFFICER_ROLES = ['INSTITUTE_OFFICER', 'SCRUTINY_OFFICER', 'DISTRICT_OFFICER', 'STATE_OFFICER', 'MOTA_OFFICER', 'SELECTION_COMMITTEE'];
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

const normalizeRole = (role) => {
  if (!role) return null;
  return role.replace(/^ROLE_/, '');
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
  try {
    const stored = localStorage.getItem('user');

    if (!stored) return null;

    const parsed = JSON.parse(stored);

    return {
      ...parsed,
      role: normalizeRole(parsed.role),
    };
  } catch {
    return null;
  }
});
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = useCallback(async (email, password) => {
  const res = await authApi.login({
    username: email,
    password,
  });

  const data = res.data.data;

  const userData = {
    userId: data.userId,
    username: data.username,
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    role: normalizeRole(data.role),
  };

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(userData));

  setToken(data.token);
  setUser(userData);

  return userData;
}, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;
  const role = user?.role || null;
  const isOfficer = role ? OFFICER_ROLES.includes(role) : false;
  const isAdmin = role ? ADMIN_ROLES.includes(role) : false;

  const hasRole = useCallback((...roles) => roles.includes(role), [role]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, role, hasRole, isOfficer, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};