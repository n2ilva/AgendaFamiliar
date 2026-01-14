import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const configureGoogleSignin = (config: any) => {
  GoogleSignin.configure(config);
};

export { GoogleSignin, statusCodes };
