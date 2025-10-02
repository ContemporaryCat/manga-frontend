"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  token: string | null;
  isLoadingAuth: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>; // Added register
  logout: () => void;
  checkAuth: () => Promise<void>; // Added checkAuth
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to decode JWT (simplified, for actual use a library like 'jwt-decode' is better)
const decodeJwt = (jwtToken: string) => {
  try {
    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const checkAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      const decoded = decodeJwt(storedToken);
      // In a real app, you might want to send this token to your backend
      // for full validation (e.g., check if user still exists, token revoked)
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setIsAuthenticated(true);
        setUser({ name: decoded.username || "User", email: decoded.email || "" });
      } else {
        localStorage.removeItem('authToken');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoadingAuth(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await fetch('https://manga-api.warpe.workers.dev/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      const decoded = decodeJwt(data.token);
      setUser({ name: decoded.username || "User", email: decoded.email || "" });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred during login.');
      }
      return false;
    }
  }, []);

  const register = useCallback(async (username: string, password: string, email: string) => {
    try {
      const response = await fetch('https://manga-api.warpe.workers.dev/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // No token returned on register, just success message
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred during registration.');
      }
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    alert("Logged out!");
  }, []);

  const value = {
    isAuthenticated,
    user,
    token,
    isLoadingAuth,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};