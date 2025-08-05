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
import { db, handleFirestoreError, ensureFirestoreConnection } from './firebase';

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
  completedAt?: string;
  xpReward: number;
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
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Note Interface
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// User Settings Interface
export interface UserSettings {
  userId: string;
  theme: string;
  notifications: {
    enabled: boolean;
    reminderTimes: Array<{
      id: string;
      time: string;
      label: string;
      enabled: boolean;
    }>;
  };
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

class UserDataManager {
  private userId: string | null = null;

  setUser(user: User | null) {
    this.userId = user?.uid || null;
  }

  // User Profile Management
  async createUserProfile(user: User): Promise<void> {
    if (!user.uid) throw new Error('User ID required');

    try {
      await ensureFirestoreConnection();
      
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Hunter',
        level: 1,
        xp: 0,
        rank: 'E-Rank',
        streak: 0,
        totalGoalsCompleted: 0,
        lastLoginDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log('User profile created successfully:', user.uid);
      
      // Create default categories for new user
      await this.createDefaultCategories(user.uid);
    } catch (error) {
      console.error('Error creating user profile:', error);
      await handleFirestoreError(error);
      throw error;
    }
  }

  async getUserProfile(userId?: string): Promise<UserProfile | null> {
    const uid = userId || this.userId;
    if (!uid) throw new Error('User not authenticated');

    try {
      await ensureFirestoreConnection();
      
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      await handleFirestoreError(error);
      throw error;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    try {
      await ensureFirestoreConnection();
      
      const userRef = doc(db, 'users', this.userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      await handleFirestoreError(error);
      throw error;
    }
  }

  // Goals Management
  async createGoal(goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.userId) throw new Error('User not authenticated');

    try {
      await ensureFirestoreConnection();
      
      const goal: Omit<Goal, 'id'> = {
        ...goalData,
        userId: this.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'goals'), goal);
      console.log('Goal created successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating goal:', error);
      await handleFirestoreError(error);
      throw error;
    }
  }

  async getUserGoals(): Promise<Goal[]> {
    if (!this.userId) throw new Error('User not authenticated');

    try {
      await ensureFirestoreConnection();
      
      const q = query(
        collection(db, 'goals'),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }) as Goal);
    } catch (error) {
      console.error('Error getting user goals:', error);
      await handleFirestoreError(error);
      throw error;
    }
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const goalRef = doc(db, 'goals', goalId);
    await updateDoc(goalRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    // If goal is completed, update user XP and stats
    if (updates.status === 'completed' && updates.completedAt) {
      await this.updateUserXP(updates.xpReward || 10);
    }
  }

  async deleteGoal(goalId: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');
    await deleteDoc(doc(db, 'goals', goalId));
  }

  // Categories Management
  async createDefaultCategories(userId: string): Promise<void> {
    const defaultCategories = [
      { name: 'Main Mission', icon: '⚔️', originalName: 'Main Mission' },
      { name: 'Training', icon: '🛡️', originalName: 'Training' },
      { name: 'Side Quest', icon: '⭐', originalName: 'Side Quest' }
    ];

    for (const cat of defaultCategories) {
      await addDoc(collection(db, 'categories'), {
        ...cat,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }

  async getUserCategories(): Promise<Category[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'categories'),
      where('userId', '==', this.userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }) as Category);
  }

  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  // Notes Management
  async createNote(noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.userId) throw new Error('User not authenticated');

    const note: Omit<Note, 'id'> = {
      ...noteData,
      userId: this.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'notes'), note);
    return docRef.id;
  }

  async getUserNotes(): Promise<Note[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'notes'),
      where('userId', '==', this.userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }) as Note);
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteNote(noteId: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');
    await deleteDoc(doc(db, 'notes', noteId));
  }

  // User Settings Management
  async getUserSettings(): Promise<UserSettings | null> {
    if (!this.userId) throw new Error('User not authenticated');

    const docRef = doc(db, 'settings', this.userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserSettings;
    }
    return null;
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const settingsRef = doc(db, 'settings', this.userId);
    await setDoc(settingsRef, {
      ...settings,
      userId: this.userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  // XP and Level Management
  private async updateUserXP(xpGained: number): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const userProfile = await this.getUserProfile();
    if (!userProfile) return;

    const newXP = userProfile.xp + xpGained;
    const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level
    const newRank = this.calculateRank(newLevel);

    await this.updateUserProfile({
      xp: newXP,
      level: newLevel,
      rank: newRank,
      totalGoalsCompleted: userProfile.totalGoalsCompleted + 1
    });
  }

  private calculateRank(level: number): string {
    if (level >= 50) return 'S-Rank';
    if (level >= 40) return 'A-Rank';
    if (level >= 30) return 'B-Rank';
    if (level >= 20) return 'C-Rank';
    if (level >= 10) return 'D-Rank';
    return 'E-Rank';
  }

  // Real-time listeners
  subscribeToUserProfile(callback: (profile: UserProfile | null) => void): () => void {
    if (!this.userId) throw new Error('User not authenticated');

    return onSnapshot(doc(db, 'users', this.userId), (doc: DocumentSnapshot<DocumentData>) => {
      if (doc.exists()) {
        callback(doc.data() as UserProfile);
      } else {
        callback(null);
      }
    });
  }

  subscribeToUserGoals(callback: (goals: Goal[]) => void): () => void {
    if (!this.userId) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', this.userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const goals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }) as Goal);
      callback(goals);
    });
  }
}

export const userDataManager = new UserDataManager();