'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenManager, userApi, UserResponse, ApiError } from 'src/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLoading: boolean;
  needsOnboarding: boolean;
  login: (tokens: { token: string; refresh_token: string; user_id: string }) => void;
  logout: () => void;
  refreshAuth: () => void;
  checkUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const checkUserProfile = async () => {
    const tokens = tokenManager.getTokens();
    if (!tokens.access_token) {
      setIsLoading(false);
      return;
    }

    try {
      const userProfile = await userApi.getCurrentUser();
      setUser(userProfile);
      setIsAuthenticated(true);
      setNeedsOnboarding(false);
    } catch (error) {
      const apiError = error as ApiError;
      
      // If we get a 404 or similar error indicating user needs onboarding
      if (apiError.status === 404 || apiError.status === 400) {
        setNeedsOnboarding(true);
        setIsAuthenticated(true); // Still authenticated, just needs onboarding
      } else {
        // Other errors might indicate invalid token
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = () => {
    const tokens = tokenManager.getTokens();
    if (tokens.access_token) {
      setIsAuthenticated(true);
      checkUserProfile();
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setNeedsOnboarding(false);
      setIsLoading(false);
    }
  };

  const login = (tokens: { token: string; refresh_token: string; user_id: string }) => {
    tokenManager.setTokens(tokens);
    setIsAuthenticated(true);
    setIsLoading(true);
    checkUserProfile();
  };

  const logout = () => {
    tokenManager.clearTokens();
    setIsAuthenticated(false);
    setUser(null);
    setNeedsOnboarding(false);
    setIsLoading(false);
  };

  useEffect(() => {
    // Initialize auth state on mount
    const initializeAuth = () => {
      const tokens = tokenManager.getTokens();
      if (tokens.access_token) {
        setIsAuthenticated(true);
        checkUserProfile();
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setNeedsOnboarding(false);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user,
        isLoading,
        needsOnboarding,
        login, 
        logout, 
        refreshAuth,
        checkUserProfile
      }}
    >
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
