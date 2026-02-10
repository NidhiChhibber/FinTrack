// client/src/context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      void verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${tokenToVerify}` },
      });

      const data = await response.json();
      const userPayload = data.data || data.user;

      if (response.ok && userPayload) {
        setUser(userPayload);
      } else {
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch {
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data?.error || 'Login failed');
    }

    const { token: newToken, user: newUser } = data.data;
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (email: string, password: string, name: string, username: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, username }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data?.error || 'Registration failed');
    }

    const { token: newToken, user: newUser } = data.data;
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};