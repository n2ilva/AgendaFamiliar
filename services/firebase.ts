// IMPORTANT: This must be the first import for Firebase to work on React Native
import 'react-native-get-random-values';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
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
  console.error('Missing Firebase configuration:', missingVars);
  throw new Error(
    `Firebase configuration error: Missing values for: ${missingVars.join(', ')}. ` +
    'Please ensure your app.config.js or .env file is properly configured with all required Firebase credentials.'
  );
}

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Configure Auth persistence for React Native
// React Native uses AsyncStorage automatically, but we need to ensure it's set correctly
if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
  // React Native environment
  console.log('[Firebase] Configuring Auth persistence for React Native...');
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log('[Firebase] Auth persistence enabled (LOCAL) for React Native');
    })
    .catch((error) => {
      console.error('[Firebase] Failed to set Auth persistence:', error);
    });
} else {
  // Web environment
  console.log('[Firebase] Configuring Auth persistence for Web...');
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log('[Firebase] Auth persistence enabled (LOCAL) for Web');
    })
    .catch((error) => {
      console.error('[Firebase] Failed to set Auth persistence:', error);
    });
}

// Enable offline persistence with platform detection
// Only enable IndexedDB persistence on web platform (where LocalStorage exists)
if (
  typeof window !== 'undefined' &&
  typeof window.localStorage !== 'undefined'
) {
  // Web platform - use IndexedDB
  firestore.enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore: Multiple tabs open, persistence disabled');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore: Persistence not supported in this browser');
    }
  });
} else {
  // React Native: Persistence is automatically enabled via AsyncStorage if installed.
  console.log('React Native detected - Firestore persistence via AsyncStorage');
}

export const db = firestore;

export default firebase;
