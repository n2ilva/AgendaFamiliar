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

if (missingVars.length > 0) {
  console.warn('[Firebase] Missing configuration for:', missingVars.join(', '));
  console.warn('[Firebase] Ensure your .env or EAS secrets are configured correctly. The app will proceed but Firebase features may fail.');
}

// Initialize Firebase
if (!firebase.apps.length) {
  const app = firebase.initializeApp(firebaseConfig);

  // High-reliability Auth initialization for React Native
  try {
    // We use the modular initializeAuth to explicitly set AsyncStorage persistence
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');

    if (getReactNativePersistence && AsyncStorage) {
      console.log('[Firebase] Initializing Auth with ReactNativePersistence (AsyncStorage)...');
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      console.log('[Firebase] Auth initialization successful');
    }
  } catch (error) {
    // If modular initialization fails or isn't needed, we continue with compat
    console.log('[Firebase] Note: Using standard Auth initialization');
  }
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = firestore;

export default firebase;
