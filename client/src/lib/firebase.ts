import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, enableNetwork, disableNetwork, terminate, clearIndexedDbPersistence } from "firebase/firestore";

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

// Enhanced Firestore initialization with robust error recovery
let firestoreInstance: any = null;
let isFirestoreInitialized = false;
let connectionRetryCount = 0;
const MAX_RETRY_ATTEMPTS = 3;

const initializeFirestore = async () => {
  try {
    if (!isFirestoreInitialized) {
      console.log('Initializing Firestore with enhanced error handling...');
      firestoreInstance = getFirestore(app);
      isFirestoreInitialized = true;
      connectionRetryCount = 0;
      console.log('Firestore initialized successfully');
    }
    return firestoreInstance;
  } catch (error) {
    console.error('Firestore initialization failed:', error);
    throw error;
  }
};

// Get Firestore instance with lazy initialization
export const getFirestoreInstance = async () => {
  if (!firestoreInstance) {
    await initializeFirestore();
  }
  return firestoreInstance;
};

// Legacy export for compatibility
export let db: any;

// Initialize immediately but handle errors gracefully
(async () => {
  try {
    db = await getFirestoreInstance();
  } catch (error) {
    console.error('Failed to initialize Firestore on startup:', error);
  }
})();

// Enhanced connection recovery with exponential backoff
export const ensureFirestoreConnection = async () => {
  try {
    if (!firestoreInstance) {
      await initializeFirestore();
    }
    
    if (connectionRetryCount < MAX_RETRY_ATTEMPTS) {
      await enableNetwork(firestoreInstance);
      console.log('Firestore connection restored');
      connectionRetryCount = 0;
      return true;
    } else {
      console.error('Max retry attempts reached, connection failed');
      return false;
    }
  } catch (error) {
    connectionRetryCount++;
    console.warn(`Firestore connection attempt ${connectionRetryCount} failed:`, error);
    
    if (connectionRetryCount >= MAX_RETRY_ATTEMPTS) {
      console.error('Giving up on Firestore connection after max retries');
      return false;
    }
    
    // Exponential backoff
    const delay = Math.pow(2, connectionRetryCount) * 1000;
    setTimeout(() => ensureFirestoreConnection(), delay);
    return false;
  }
};

// Robust error handling for 400 errors
export const handleFirestoreError = async (error: any) => {
  console.error('Firestore error detected:', error);
  
  // Handle specific error codes
  if (error?.code === 'unavailable' || 
      error?.message?.includes('400') || 
      error?.message?.includes('Bad Request') ||
      error?.code === 'resource-exhausted') {
    
    console.log('Attempting aggressive Firestore recovery...');
    
    try {
      // Terminate existing connection
      if (firestoreInstance) {
        await terminate(firestoreInstance);
      }
      
      // Clear any cached data
      try {
        await clearIndexedDbPersistence(firestoreInstance);
      } catch (clearError) {
        console.warn('Could not clear persistence:', clearError);
      }
      
      // Reset state
      isFirestoreInitialized = false;
      firestoreInstance = null;
      connectionRetryCount = 0;
      
      // Wait and reinitialize
      setTimeout(async () => {
        try {
          await initializeFirestore();
          db = firestoreInstance;
        } catch (reinitError) {
          console.error('Failed to reinitialize Firestore:', reinitError);
        }
      }, 3000);
      
    } catch (recoveryError) {
      console.error('Failed to recover from Firestore error:', recoveryError);
    }
  }
  
  return false;
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
