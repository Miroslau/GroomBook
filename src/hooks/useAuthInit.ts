import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { logoutAction, setUser } from '../store/feature/auth/authSlice';

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const { isInitializing, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(logoutAction());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { isInitializing, isAuthenticated };
};
