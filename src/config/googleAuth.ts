/**
 * Google OAuth Configuration
 * 
 * Centralized configuration for Google OAuth Client IDs
 * Used by both LoginScreen and SettingsScreen
 */

// Web Client ID - Used for Expo Go and Web builds
export const GOOGLE_WEB_CLIENT_ID = '328256268071-stldq283utksgkddalb8ja0stc84c4gk.apps.googleusercontent.com';

// Android Client ID - Used for standalone APK/AAB builds
// Configured in Google Cloud Console with:
// - Package name: com.natanael.agendafamiliar
// - SHA-1 fingerprint from your signing key
export const GOOGLE_ANDROID_CLIENT_ID = '328256268071-mudr2hodd4nio8tbebe70ba2l7i7ok3a.apps.googleusercontent.com';

// iOS Client ID - Used for standalone iOS builds
// Note: May need to create a separate iOS client in Google Cloud Console
export const GOOGLE_IOS_CLIENT_ID = '328256268071-stldq283utksgkddalb8ja0stc84c4gk.apps.googleusercontent.com';

// Export all as default object for convenience
export default {
  webClientId: GOOGLE_WEB_CLIENT_ID,
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
};
