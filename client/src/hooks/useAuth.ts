import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signInWithGoogle, logOut } from '@/lib/firebase';

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
    console.log('AuthProvider: Setting up auth state listener');
    
    // Add timeout to prevent infinite loading in production
    const loadingTimeout = setTimeout(() => {
      console.log('AuthProvider: Timeout reached, stopping loading state');
      setLoading(false);
    }, 8000); // 8 second timeout
    
    let isUnmounted = false;
    
    const unsubscribe = onAuthStateChange(async (user) => {
      if (isUnmounted) return;
      
      console.log('AuthProvider: Auth state changed', { user: user ? user.email : 'null' });
      clearTimeout(loadingTimeout); // Clear timeout when auth state resolves
      setUser(user);
      
      if (user && !isUnmounted) {
        try {
          // Set user in data manager for proper data isolation
          const { userDataManager } = await import('@/lib/userDataManager');
          userDataManager.setUser(user);
          
          // Check if user profile exists, create if not
          const profile = await userDataManager.getUserProfile();
          if (!profile && !isUnmounted) {
            console.log('Creating new user profile for:', user.email);
            await userDataManager.createUserProfile(user);
          } else if (!isUnmounted) {
            // Update last login date
            await userDataManager.updateUserProfile({
              lastLoginDate: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error managing user profile:', error);
          // Don't let profile errors block the app
        }
      }
      
      if (!isUnmounted) {
        setLoading(false);
      }
    });

    return () => {
      isUnmounted = true;
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      console.log('AuthProvider: Attempting Google sign in');
      const user = await signInWithGoogle();
      console.log('AuthProvider: Sign in successful', { user: user ? user.email : 'null' });
      return user;
    } catch (error) {
      console.error('AuthProvider: Sign in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Sign out error:', error);
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