// IMPORTANT: This must be the very first part of the file to fix persistence issues
// Polyfill for localStorage which is expected by some Firebase modules even in React Native
if (typeof global !== 'undefined' && !(global as any).localStorage) {
  (global as any).localStorage = {
    getItem: (_key: string) => null,
    setItem: (_key: string, _value: string) => { },
    removeItem: (_key: string) => { },
    clear: () => { },
    length: 0,
    key: (_index: number) => null,
  };
}

// Required for Firebase to work on React Native
import 'react-native-get-random-values';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get Firebase config from app.config.js extra field or fallback to env vars
const getFirebaseConfig = () => {
  const extra = Constants.expoConfig?.extra;

  return {
    apiKey: extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain:
      extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:
      extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:
      extra?.firebaseStorageBucket ||
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      extra?.firebaseMessagingSenderId ||
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
};

const firebaseConfig = getFirebaseConfig();

// Validate configuration
const missingVars = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

// Track if Firebase is properly configured
let firebaseReady = false;

if (missingVars.length > 0) {
  console.warn('[Firebase] Missing configuration for:', missingVars.join(', '));
  console.warn('[Firebase] Firebase features will be DISABLED. Configure EAS secrets or .env file.');
} else {
  // Initialize Firebase ONLY when config is complete
  try {
    if (!firebase.apps.length) {
      const app = firebase.initializeApp(firebaseConfig);

      // High-reliability Auth initialization for React Native
      try {
        const { initializeAuth, getReactNativePersistence } = require('firebase/auth');

        if (getReactNativePersistence && AsyncStorage) {
          console.log('[Firebase] Initializing Auth with ReactNativePersistence (AsyncStorage)...');
          initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage)
          });
          console.log('[Firebase] Auth initialization successful');
        }
      } catch (authError) {
        console.log('[Firebase] Note: Using standard Auth initialization');
      }
    }
    firebaseReady = true;
    console.log('[Firebase] Initialization complete');
  } catch (error) {
    console.error('[Firebase] Initialization failed:', error);
  }
}

// Safe exports - return mock objects if Firebase is not initialized
const getAuth = () => {
  if (firebaseReady) {
    return firebase.auth();
  }
  // Return a mock auth object that doesn't crash
  return {
    onAuthStateChanged: (callback: any) => {
      // Immediately call with null user
      setTimeout(() => callback(null), 0);
      return () => { }; // unsubscribe function
    },
    signInWithEmailAndPassword: async () => {
      throw new Error('Firebase não configurado. Verifique as variáveis de ambiente.');
    },
    createUserWithEmailAndPassword: async () => {
      throw new Error('Firebase não configurado. Verifique as variáveis de ambiente.');
    },
    signOut: async () => { },
    currentUser: null,
  } as any;
};

const getFirestore = () => {
  if (firebaseReady) {
    return firebase.firestore();
  }
  // Return a mock firestore object
  return {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => { },
        update: async () => { },
        delete: async () => { },
      }),
      where: () => ({
        get: async () => ({ docs: [], empty: true }),
      }),
      onSnapshot: () => () => { },
    }),
  } as any;
};

export const auth = getAuth();
export const firestore = getFirestore();
export const db = firestore;
export const isFirebaseReady = firebaseReady;

export default firebase;
