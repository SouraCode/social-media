import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../lib/api';
import type { Profile } from '../lib/api';

type AuthContextType = {
  user: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        // Set user immediately from localStorage to prevent flash
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Then verify with server
        loadCurrentUser();
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  async function loadCurrentUser() {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error loading current user:', error);
      // Only clear if it's an auth error, not a network error
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, username: string, fullName: string) {
    const { token, user: userData } = await authAPI.register({
      username,
      full_name: fullName,
      email,
      password,
    });

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }

  async function signIn(email: string, password: string) {
    const { token, user: userData } = await authAPI.login({ email, password });

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }

  async function signOut() {
    authAPI.logout();
    setUser(null);
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
