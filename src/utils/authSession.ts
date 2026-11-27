import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { configureGoogleSignIn } from './googleAuthConfig';

export const performFullSignOut = async (onBeforeSignOut?: () => Promise<void> | void) => {
  if (onBeforeSignOut) {
    await onBeforeSignOut();
  }

  configureGoogleSignIn();

  try {
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
  } catch (error: unknown) {
    console.warn('Google signOut warning:', error);
  }

  await signOut(auth);
};
