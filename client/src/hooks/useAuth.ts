import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signInWithGoogle, logOut, handleRedirectResult } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result first (for Google sign-in redirect)
    handleRedirectResult().then((redirectUser) => {
      if (redirectUser) {
        setUser(redirectUser);
        initializeUser(redirectUser);
      }
    });

    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        await initializeUser(user);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const initializeUser = async (user: User) => {
    // Set user in data manager for proper data isolation
    const { userDataManager } = await import('@/lib/userDataManager');
    userDataManager.setUser(user);
    
    // Check if user profile exists in Firestore, create if not
    try {
      const profile = await userDataManager.getUserProfile();
      if (!profile) {
        await userDataManager.createUserProfile(user);
      } else {
        // Update last login date
        await userDataManager.updateUserProfile({
          lastLoginDate: new Date().toISOString()
        });
      }
    } catch (error) {
      // Silently handle profile creation errors in production
      await userDataManager.createUserProfile(user);
    }
  };

  const signIn = async () => {
    try {
      const user = await signInWithGoogle();
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await logOut();
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut: signOutUser,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}