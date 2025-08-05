import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy,
  addDoc,
  deleteDoc,
  getDocs,
  DocumentSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { getFirestoreInstance, handleFirestoreError } from './firebase';

// User Profile Interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  level: number;
  xp: number;
  rank: string;
  streak: number;
  totalGoalsCompleted: number;
  lastLoginDate: string;
  createdAt: string;
  updatedAt: string;
}

// Goal Interface
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate?: string;
  xpReward: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Category Interface
export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  originalName: string;
  createdAt: string;
  updatedAt: string;
}

// Note Interface
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// User Settings Interface
export interface UserSettings {
  userId: string;
  dailyGoalTarget: number;
  notificationsEnabled: boolean;
  reminderTimes: Array<{
    id: string;
    time: string;
    label: string;
    enabled: boolean;
  }>;
  theme: 'light' | 'dark';
  createdAt: string;
  updatedAt: string;
}

class UserDataManager {
  private userId: string | null = null;

  setUser(user: User) {
    this.userId = user.uid;
    console.log('UserDataManager: User set for:', user.email);
  }

  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      console.error('Firestore operation failed:', error);
      
      // Handle 400 errors specifically
      if (error?.message?.includes('400') || error?.code === 'unavailable') {
        console.log('Handling Firestore 400 error, attempting recovery...');
        await handleFirestoreError(error);
        
        // Retry operation after recovery attempt
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return await operation();
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          throw retryError;
        }
      }
      
      throw error;
    }
  }

  // User Profile Management
  async createUserProfile(user: User): Promise<UserProfile> {
    if (!this.userId) throw new Error('User not authenticated');

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      level: 1,
      xp: 0,
      rank: 'E-Rank',
      streak: 0,
      totalGoalsCompleted: 0,
      lastLoginDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      await setDoc(doc(db, 'users', user.uid), profile);
      await this.createDefaultCategories(user.uid);
      return profile;
    });
  }

  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const docRef = doc(db, 'users', this.userId!);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    });
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const userRef = doc(db, 'users', this.userId!);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    });
  }

  // Goals Management
  async createGoal(goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const goal: Omit<Goal, 'id'> = {
        ...goalData,
        userId: this.userId!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'goals'), goal);
      return docRef.id;
    });
  }

  async getUserGoals(): Promise<Goal[]> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const q = query(
        collection(db, 'goals'),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }) as Goal);
    });
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    });
  }

  async deleteGoal(goalId: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');
    
    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      await deleteDoc(doc(db, 'goals', goalId));
    });
  }

  // Categories Management
  async createDefaultCategories(userId: string): Promise<void> {
    const defaultCategories = [
      { name: 'Main Mission', icon: '⚔️', originalName: 'Main Mission' },
      { name: 'Training', icon: '🛡️', originalName: 'Training' },
      { name: 'Side Quest', icon: '⭐', originalName: 'Side Quest' }
    ];

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      for (const cat of defaultCategories) {
        await addDoc(collection(db, 'categories'), {
          ...cat,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });
  }

  async getUserCategories(): Promise<Category[]> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const q = query(
        collection(db, 'categories'),
        where('userId', '==', this.userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }) as Category);
    });
  }

  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    });
  }

  // Notes Management
  async createNote(noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const note: Omit<Note, 'id'> = {
        ...noteData,
        userId: this.userId!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'notes'), note);
      return docRef.id;
    });
  }

  async getUserNotes(): Promise<Note[]> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const q = query(
        collection(db, 'notes'),
        where('userId', '==', this.userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }) as Note);
    });
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    });
  }

  async deleteNote(noteId: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');
    
    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      await deleteDoc(doc(db, 'notes', noteId));
    });
  }

  // User Settings Management
  async getUserSettings(): Promise<UserSettings | null> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const docRef = doc(db, 'settings', this.userId!);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserSettings;
      }
      return null;
    });
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    return this.executeWithRetry(async () => {
      const db = await getFirestoreInstance();
      const settingsRef = doc(db, 'settings', this.userId!);
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      });
    });
  }

  // Utility functions
  calculateNextLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
  }

  getRankForLevel(level: number): string {
    if (level >= 50) return 'S-Rank';
    if (level >= 40) return 'A-Rank';
    if (level >= 30) return 'B-Rank';
    if (level >= 20) return 'C-Rank';
    if (level >= 10) return 'D-Rank';
    return 'E-Rank';
  }

  // Real-time listeners with error handling
  subscribeToUserProfile(callback: (profile: UserProfile | null) => void): () => void {
    if (!this.userId) throw new Error('User not authenticated');

    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      try {
        const db = await getFirestoreInstance();
        unsubscribe = onSnapshot(
          doc(db, 'users', this.userId!), 
          (doc: DocumentSnapshot<DocumentData>) => {
            if (doc.exists()) {
              callback(doc.data() as UserProfile);
            } else {
              callback(null);
            }
          },
          (error) => {
            console.error('Profile subscription error:', error);
            handleFirestoreError(error);
          }
        );
      } catch (error) {
        console.error('Failed to setup profile listener:', error);
        await handleFirestoreError(error);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }

  subscribeToUserGoals(callback: (goals: Goal[]) => void): () => void {
    if (!this.userId) throw new Error('User not authenticated');

    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      try {
        const db = await getFirestoreInstance();
        const q = query(
          collection(db, 'goals'),
          where('userId', '==', this.userId),
          orderBy('createdAt', 'desc')
        );

        unsubscribe = onSnapshot(
          q, 
          (querySnapshot: QuerySnapshot<DocumentData>) => {
            const goals = querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }) as Goal);
            callback(goals);
          },
          (error) => {
            console.error('Goals subscription error:', error);
            handleFirestoreError(error);
          }
        );
      } catch (error) {
        console.error('Failed to setup goals listener:', error);
        await handleFirestoreError(error);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }
}

export const userDataManager = new UserDataManager();