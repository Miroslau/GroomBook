import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { setUser } from '../store/feature/auth/authSlice';

const WEB_CLIENT_ID = '907187837254-99o7pjb4sid54eg94scdj1qo9mok74f9.apps.googleusercontent.com';

interface UseGoogleAuthResult {
  signInWithGoogle: () => Promise<void>;
  isLoggingIn: boolean;
  error: string | null;
}

export const useGoogleAuth = (): UseGoogleAuthResult => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoggingIn(true);
      setError(null);

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('Google Sign-In: Не удалось получить ID Token.');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      dispatch(
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        })
      );
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      // Обработка отмены (чтобы не спамить ошибками, если пользователь просто закрыл окно)
      if (error.code === 'SIGN_IN_CANCELLED') {
        setError('Вход отменен пользователем');
      } else {
        setError(error.message || 'Произошла ошибка при входе через Google');
      }
    } finally {
      setIsLoggingIn(false);
    }
  }, [dispatch]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  return { signInWithGoogle, isLoggingIn, error };
};
