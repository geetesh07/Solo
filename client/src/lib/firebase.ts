import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";

// Validate required Firebase configuration
if (!import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.VITE_FIREBASE_PROJECT_ID || !import.meta.env.VITE_FIREBASE_APP_ID) {
  console.error('Firebase configuration incomplete. Missing required environment variables.');
  console.error('Available env vars:', {
    hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID
  });
  throw new Error('Firebase configuration incomplete. Missing required environment variables.');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence and handle connection issues
let isFirestoreEnabled = true;

// Function to handle Firestore connection recovery
export const ensureFirestoreConnection = async () => {
  if (!isFirestoreEnabled) {
    try {
      await enableNetwork(db);
      isFirestoreEnabled = true;
      console.log('Firestore connection restored');
    } catch (error) {
      console.warn('Failed to restore Firestore connection:', error);
    }
  }
};

// Function to handle connection errors gracefully
export const handleFirestoreError = async (error: any) => {
  console.error('Firestore error:', error);
  
  if (error?.code === 'unavailable' || error?.message?.includes('400')) {
    console.log('Attempting to restore Firestore connection...');
    try {
      await disableNetwork(db);
      isFirestoreEnabled = false;
      
      // Wait a bit then re-enable
      setTimeout(async () => {
        await ensureFirestoreConnection();
      }, 2000);
    } catch (retryError) {
      console.warn('Failed to recover Firestore connection:', retryError);
    }
  }
};

console.log('Firebase initialized with project:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    console.log('Firebase: Attempting Google sign-in...');
    const result = await signInWithPopup(auth, provider);
    console.log('Firebase: Sign-in successful:', result.user?.email);
    return result.user;
  } catch (error: any) {
    console.error("Firebase: Sign-in error:", error);
    
    // Provide better error messages for production
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
