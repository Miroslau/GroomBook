import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { mapFirebaseUser, setUser } from '../store/feature/auth/authSlice';
import { configureGoogleSignIn } from '../utils/googleAuthConfig';

interface UseGoogleAuthResult {
  signInWithGoogle: () => Promise<void>;
  clearError: () => void;
  isLoggingIn: boolean;
  error: string | null;
}

const getAuthErrorMessage = (error: unknown): string | null => {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return null;
      case statusCodes.IN_PROGRESS:
        return null;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Сервисы Google Play недоступны или устарели на этом устройстве.';
      case 'auth/network-request-failed':
      case 'NETWORK_ERROR':
        return 'Для первого входа нужен интернет. Проверьте подключение и попробуйте снова.';
      case 'DEVELOPER_ERROR':
        return 'Ошибка конфигурации входа Google (проверьте SHA-1 и webClientId).';
      default:
        return error.message || 'Не удалось выполнить вход через Google.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Произошла неизвестная ошибка при входе через Google.';
};

export const useGoogleAuth = (): UseGoogleAuthResult => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isLoggingInRef = useRef<boolean>(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (isLoggingInRef.current) {
      return;
    }

    isLoggingInRef.current = true;
    setIsLoggingIn(true);
    setError(null);

    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const response = await GoogleSignin.signIn();

      if (isCancelledResponse(response)) {
        return;
      }

      if (!isSuccessResponse(response) || !response.data.idToken) {
        throw new Error('Не удалось получить токен авторизации Google.');
      }

      const credential = GoogleAuthProvider.credential(response.data.idToken);
      const userCredential = await signInWithCredential(auth, credential);

      dispatch(setUser(mapFirebaseUser(userCredential.user)));
    } catch (error: unknown) {
      console.error('Google Sign-In Error:', error);
      const message = getAuthErrorMessage(error);
      if (message) {
        setError(message);
      }
    } finally {
      isLoggingInRef.current = false;
      setIsLoggingIn(false);
    }
  }, [dispatch]);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return { signInWithGoogle, clearError, isLoggingIn, error };
};
