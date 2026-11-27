import { GoogleSignin } from '@react-native-google-signin/google-signin';

const WEB_CLIENT_ID: string = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const IOS_CLIENT_ID: string = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

let isConfigured = false;

export const configureGoogleSignIn = (): void => {
  if (isConfigured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    offlineAccess: true,
  });

  isConfigured = true;
};
