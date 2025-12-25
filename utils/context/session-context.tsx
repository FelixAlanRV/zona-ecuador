'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ----------------------------------------------------------------------

export type Client = {
  id: string;
  name: string;
  taxId: string;
};

export type User = {
  username: string;
  clients: Client[];
};

type SessionContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
};

// ----------------------------------------------------------------------

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// ----------------------------------------------------------------------

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  // Initialize state from localStorage using lazy initialization
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    
    const storedUser = localStorage.getItem('session_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('session_user');
      }
    }
    return null;
  });

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('session_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('session_user');
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
