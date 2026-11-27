import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@firebase/auth';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
};

export const mapFirebaseUser = (firebaseUser: User): UserData => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isInitializing = false;
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    logoutAction: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
  },
});

export const { setUser, setInitializing, logoutAction } = authSlice.actions;
export default authSlice.reducer;
