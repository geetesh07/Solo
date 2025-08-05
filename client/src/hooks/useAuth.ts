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
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('AuthProvider: Auth state changed', { user: user ? user.email : 'null' });
      setUser(user);
      
      if (user) {
        // Set user in data manager for proper data isolation
        const { userDataManager } = await import('@/lib/userDataManager');
        userDataManager.setUser(user);
        
        // Check if user profile exists, create if not
        try {
          const profile = await userDataManager.getUserProfile();
          if (!profile) {
            console.log('Creating new user profile for:', user.email);
            await userDataManager.createUserProfile(user);
          } else {
            // Update last login date
            await userDataManager.updateUserProfile({
              lastLoginDate: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error managing user profile:', error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
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