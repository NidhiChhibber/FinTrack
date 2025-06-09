// client/src/context/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  username: string; // Add username field
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      // Verify token and get user info
      verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
  console.log("[Auth] Verifying token:", token);
  try {
    const response = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("[Auth] Verification response status:", response.status);
    const data = await response.json();
    console.log("[Auth] Verification response data:", data);

    if (response.ok && data.user) {
      setUser(data.user);
    } else {
      localStorage.removeItem('auth_token');
      setToken(null);
    }
  } catch (error) {
    console.error('[Auth] Token verification error:', error);
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
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Login failed');
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
      body: JSON.stringify({ email, password, name, username })
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Registration failed');
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

console.log("[AuthProvider] token:", token);
console.log("[AuthProvider] user:", user);
console.log("[AuthProvider] isAuthenticated:", !!token && !!user);
console.log("[AuthProvider] isLoading:", isLoading);
  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!token && !!user
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};