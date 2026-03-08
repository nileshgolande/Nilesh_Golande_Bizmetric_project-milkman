import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { API_BASE_URL } from '../services/products';

export type UserRole = 'STAFF' | 'CUSTOMER';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  token: string;
  user: AuthUser;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER';
  };
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'milkman_auth';

const extractApiErrorMessage = (errorData: unknown): string => {
  if (!errorData || typeof errorData !== 'object') {
    return 'Login failed. Please verify email and password.';
  }

  const data = errorData as Record<string, unknown>;

  if (typeof data.detail === 'string' && data.detail.trim()) {
    return data.detail;
  }

  if (Array.isArray(data.non_field_errors) && typeof data.non_field_errors[0] === 'string') {
    return data.non_field_errors[0];
  }

  if (typeof data.non_field_errors === 'string' && data.non_field_errors.trim()) {
    return data.non_field_errors;
  }

  return 'Login failed. Please verify email and password.';
};

const readStoredAuth = (): AuthState | null => {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as AuthState;
    if (parsed?.user?.role !== 'CUSTOMER' && parsed?.user?.role !== 'STAFF') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    if (!parsed?.user?.name) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialState = readStoredAuth();
  const [token, setToken] = useState<string | null>(initialState?.token ?? null);
  const [user, setUser] = useState<AuthUser | null>(initialState?.user ?? null);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password;

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Email and password are required.');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(extractApiErrorMessage(errorData));
    }

    const data = (await response.json()) as LoginResponse;
    const normalizedRole: UserRole = data.user.role === 'ADMIN' ? 'STAFF' : 'CUSTOMER';
    const authState: AuthState = {
      token: data.token,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: normalizedRole,
      },
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    setToken(authState.token);
    setUser(authState.user);
    return authState.user;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
