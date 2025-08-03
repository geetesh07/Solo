import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, orderBy, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Goal, Category, CategoryWithGoals } from '@/types';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';
import { DEFAULT_CATEGORIES } from '@/lib/defaultData';

export function useGoals() {
  const { user } = useAuth();
  const { addXP } = useUserProfile();
  const [categories, setCategories] = useState<CategoryWithGoals[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    // Subscribe to categories
    const categoriesQuery = query(
      collection(db, 'categories'),
      where('userId', '==', user.uid),
      orderBy('order', 'asc')
    );

    const unsubscribeCategories = onSnapshot(categoriesQuery, async (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Category[];

      // If no categories exist, create default ones
      if (categoriesData.length === 0) {
        const categoryPromises = DEFAULT_CATEGORIES.map(async (categoryData, index) => {
          const categoryRef = doc(collection(db, 'categories'));
          const category = {
            ...categoryData,
            userId: user.uid,
            createdAt: new Date(),
          };
          await setDoc(categoryRef, category);
          return {
            id: categoryRef.id,
            ...category,
          };
        });

        const newCategories = await Promise.all(categoryPromises);
        
        // Subscribe to goals for new categories
        const goalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const unsubscribeGoals = onSnapshot(goalsQuery, (goalsSnapshot) => {
          const goalsData = goalsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dueDate: doc.data().dueDate?.toDate(),
            completedAt: doc.data().completedAt?.toDate(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as Goal[];

          const categoriesWithGoals = newCategories.map(category => ({
            ...category,
            goals: goalsData.filter(goal => goal.categoryId === category.id)
          }));

          setCategories(categoriesWithGoals);
          setLoading(false);
        });

        return () => unsubscribeGoals();
      } else {
        // Subscribe to goals for existing categories
        const goalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const unsubscribeGoals = onSnapshot(goalsQuery, (goalsSnapshot) => {
          const goalsData = goalsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dueDate: doc.data().dueDate?.toDate(),
            completedAt: doc.data().completedAt?.toDate(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as Goal[];

          // Group goals by category
          const categoriesWithGoals = categoriesData.map(category => ({
            ...category,
            goals: goalsData.filter(goal => goal.categoryId === category.id)
          }));

          setCategories(categoriesWithGoals);
          setLoading(false);
        });

        return () => unsubscribeGoals();
      }
    });

    return () => unsubscribeCategories();
  }, [user]);

  const addGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await addDoc(collection(db, 'goals'), {
        ...goalData,
        userId: user.uid,
        createdAt: new Date(),
        dueDate: goalData.dueDate ? new Date(goalData.dueDate) : null,
      });
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      const updateData = {
        ...updates,
        ...(updates.status === 'completed' && { completedAt: new Date() }),
        ...(updates.dueDate && { dueDate: new Date(updates.dueDate) }),
      };
      await updateDoc(goalRef, updateData);
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const toggleGoalStatus = async (goalId: string, currentStatus: string) => {
    const goal = categories
      .flatMap(cat => cat.goals)
      .find(goal => goal.id === goalId);
    
    if (!goal) return;

    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
      await updateGoal(goalId, { status: newStatus });
      
      // Add XP when completing a goal
      if (newStatus === 'completed') {
        await addXP(goal.xpValue);
      }
    } catch (error) {
      console.error('Error toggling goal status:', error);
      throw error;
    }
  };

  return {
    categories,
    loading,
    addGoal,
    updateGoal,
    toggleGoalStatus,
  };
}
