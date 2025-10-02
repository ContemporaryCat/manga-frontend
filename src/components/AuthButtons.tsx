"use client";

import { useState, useEffect, useCallback } from 'react';

// Custom authentication hook
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // In a real app, you'd validate this token with your backend
      setToken(storedToken);
      setIsAuthenticated(true);
      // Fetch user details from backend if needed, or decode from JWT
      setUser({ name: "Authenticated User" }); // Placeholder
    }
  }, []);

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
      setUser({ name: "Authenticated User" }); // Replace with actual user data from login response
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

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    alert("Logged out!");
  }, []);

  return { isAuthenticated, user, token, login, logout };
};

export default function AuthButtons() {
  const { isAuthenticated, user, login, logout } = useAuth();

  // Placeholder for login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  if (isAuthenticated) {
    return (
      <>
        {user?.name} <br />
        <button onClick={logout}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign in</button>
      </form>
    </>
  );
}