import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const configureGoogleSignin = (config: any) => {
  try {
    GoogleSignin.configure(config);
  } catch (error) {
    console.error('[GoogleSignin] Configuration error:', error);
  }
};

export { GoogleSignin, statusCodes };
