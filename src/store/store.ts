import { combineReducers, configureStore, UnknownAction } from '@reduxjs/toolkit';
import authReducer, { logoutAction } from './feature/auth/authSlice';
import appointmentReducer, {
  unsubscribeFromAppointments,
} from './feature/appointment/appointmentsSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const appReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
  if (action.type === 'auth/logoutAction') {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
