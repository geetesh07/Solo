import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/types';
import { useAuth } from './useAuth';

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

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, async (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          id: doc.id,
          firebaseUid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          level: data.level || 1,
          currentXP: data.currentXP || 0,
          totalXP: data.totalXP || 0,
          streak: data.streak || 0,
          rank: data.rank || 'E-Rank',
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      } else {
        // Create new user profile
        const newProfile: Omit<UserProfile, 'id'> = {
          firebaseUid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          level: 1,
          currentXP: 0,
          totalXP: 0,
          streak: 0,
          rank: 'E-Rank',
          createdAt: new Date(),
        };
        
        await setDoc(userRef, newProfile);
        setProfile({
          id: user.uid,
          ...newProfile,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, updates);
  };

  const addXP = async (xp: number) => {
    if (!profile) return;
    
    const newCurrentXP = profile.currentXP + xp;
    const newTotalXP = profile.totalXP + xp;
    
    // Level up logic
    const xpPerLevel = 1000; // Base XP needed per level
    const newLevel = Math.floor(newTotalXP / xpPerLevel) + 1;
    
    // Rank progression
    const getRank = (level: number) => {
      if (level >= 50) return 'Shadow Monarch';
      if (level >= 40) return 'S-Rank';
      if (level >= 30) return 'A-Rank';
      if (level >= 20) return 'B-Rank';
      if (level >= 10) return 'C-Rank';
      if (level >= 5) return 'D-Rank';
      return 'E-Rank';
    };

    await updateProfile({
      currentXP: newCurrentXP % xpPerLevel,
      totalXP: newTotalXP,
      level: newLevel,
      rank: getRank(newLevel),
    });
  };

  return {
    profile,
    loading,
    updateProfile,
    addXP,
  };
}
