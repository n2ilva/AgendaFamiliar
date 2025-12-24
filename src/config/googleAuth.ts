/**
 * Google OAuth Configuration
 * 
 * Centralized configuration for Google OAuth Client IDs
 * Used by both LoginScreen and SettingsScreen
 */

// Web Client ID - Used for Expo Go and Web builds
export const GOOGLE_WEB_CLIENT_ID = '1038445694694-2qhusct6udjap3s2hlaalb5i7mf7qeon.apps.googleusercontent.com';

// Android Client ID - Used for standalone APK/AAB builds
// Configured in Google Cloud Console with:
// - Package name: com.natanael.agendafamiliar
// - SHA-1 fingerprint: 83:80:68:59:EE:59:1A:49:E8:5C:20:E8:B9:3D:A4:3E:02:CF:4D:E2
export const GOOGLE_ANDROID_CLIENT_ID = '1038445694694-c5vcdk6hg63b0gj55amjcr63cc4rp0q0.apps.googleusercontent.com';

// iOS Client ID - Used for standalone iOS builds
// Note: Using Web Client ID until iOS-specific client is created
export const GOOGLE_IOS_CLIENT_ID = '1038445694694-2qhusct6udjap3s2hlaalb5i7mf7qeon.apps.googleusercontent.com';

// Export all as default object for convenience
export default {
  webClientId: GOOGLE_WEB_CLIENT_ID,
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
};
