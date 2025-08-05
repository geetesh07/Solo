import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { userDataManager, Goal, UserProfile, Category, Note } from '@/lib/userDataManager';

// Hook for user profile
export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      try {
        unsubscribe = userDataManager.subscribeToUserProfile((newProfile) => {
          setProfile(newProfile);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up profile subscription:', error);
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await userDataManager.updateUserProfile(updates);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return { profile, loading, updateProfile };
}

// Hook for user goals
export function useUserGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      try {
        unsubscribe = userDataManager.subscribeToUserGoals((newGoals) => {
          setGoals(newGoals);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up goals subscription:', error);
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const createGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      return await userDataManager.createGoal(goalData);
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await userDataManager.updateGoal(goalId, updates);
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await userDataManager.deleteGoal(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  return { goals, loading, createGoal, updateGoal, deleteGoal };
}

// Hook for user categories
export function useUserCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const loadCategories = async () => {
      try {
        const userCategories = await userDataManager.getUserCategories();
        setCategories(userCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user]);

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await userDataManager.updateCategory(categoryId, updates);
      // Reload categories after update
      const userCategories = await userDataManager.getUserCategories();
      setCategories(userCategories);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  return { categories, loading, updateCategory };
}

// Hook for user notes
export function useUserNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const loadNotes = async () => {
      try {
        const userNotes = await userDataManager.getUserNotes();
        setNotes(userNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [user]);

  const createNote = async (noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const noteId = await userDataManager.createNote(noteData);
      // Reload notes after creation
      const userNotes = await userDataManager.getUserNotes();
      setNotes(userNotes);
      return noteId;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await userDataManager.updateNote(noteId, updates);
      // Reload notes after update
      const userNotes = await userDataManager.getUserNotes();
      setNotes(userNotes);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await userDataManager.deleteNote(noteId);
      // Reload notes after deletion
      const userNotes = await userDataManager.getUserNotes();
      setNotes(userNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  return { notes, loading, createNote, updateNote, deleteNote };
}