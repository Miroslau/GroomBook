import { FirestoreAppointment } from '../../../types/FirestoreAppointment';
import { WeekStatusEnum } from '../../../enums/weekStatus';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { endOfWeek, format, parseISO, startOfWeek } from 'date-fns';
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../../utils/firebaseConfig';
import { AppointmentFormData } from '../../../types/appointmentFormSchema';
import { RootState } from '../../store';
import {
  buildAppointmentDocId,
  getErrorMessage,
  normalizeSlotTime,
} from '../../../utils/timeUtils';
import { logoutAction } from '../auth/authSlice';

interface SubscribeWeekPayload {
  weekStartDate: string;
  uid: string;
}

interface CreateAppointmentPayload {
  uid: string;
  dateStr: string;
  slotTime: string;
  formData: AppointmentFormData;
}

interface AppointmentsState {
  weekAppointments: FirestoreAppointment[];
  status: WeekStatusEnum;
  error: string | null;
}

const initialState: AppointmentsState = {
  weekAppointments: [],
  status: WeekStatusEnum.IDLE,
  error: null,
};

let unsubscribeTimeLine: (() => void) | null = null;

export const subscribeToWeekAppointments = createAsyncThunk<void, SubscribeWeekPayload>(
  'appointments/subscribeToWeek',
  async ({ weekStartDate, uid }, { dispatch }) => {
    if (unsubscribeTimeLine) {
      unsubscribeTimeLine();
      unsubscribeTimeLine = null;
    }

    dispatch(appointmentsSlice.actions.setStatus(WeekStatusEnum.LOADING));

    const parsedDate = parseISO(weekStartDate);
    const start = startOfWeek(parsedDate, { weekStartsOn: 1 });
    const end = endOfWeek(parsedDate, { weekStartsOn: 1 });

    const startDateStr = format(start, 'yyyy-MM-dd');
    const endDateStr = format(end, 'yyyy-MM-dd');

    const appointmentsRef = collection(db, 'users', uid, 'appointments');
    const q = query(
      appointmentsRef,
      where('date', '>=', startDateStr),
      where('date', '<=', endDateStr)
    );

    return new Promise<void>((resolve, reject) => {
      unsubscribeTimeLine = onSnapshot(
        q,
        (snapshot) => {
          const appointmentsData: FirestoreAppointment[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();

            const createdAtIso = data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : new Date().toISOString();

            const updatedAtIso = data.updatedAt?.toDate
              ? data.updatedAt.toDate().toISOString()
              : new Date().toISOString();

            return {
              id: docSnap.id,
              date: String(data.date ?? ''),
              slotTime: normalizeSlotTime(data.slotTime, data.slotHour),
              slotHour: typeof data.slotHour === 'number' ? data.slotHour : undefined,
              clientName: String(data.clientName ?? ''),
              pet: String(data.pet ?? ''),
              service: String(data.service ?? ''),
              createdAt: createdAtIso,
              updatedAt: updatedAtIso,
            };
          });

          dispatch(appointmentsSlice.actions.setWeekAppointments(appointmentsData));
          resolve();
        },
        (error) => {
          dispatch(appointmentsSlice.actions.setError(error.message));
          reject(error);
        }
      );
    });
  }
);

export const unsubscribeFromAppointments = createAsyncThunk(
  'appointments/unsubscribe',
  async () => {
    if (unsubscribeTimeLine) {
      unsubscribeTimeLine();
      unsubscribeTimeLine = null;
    }
  }
);

export const createAppointment = createAsyncThunk<FirestoreAppointment, CreateAppointmentPayload>(
  'appointments/create',
  async ({ uid, dateStr, slotTime, formData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const isSlotBooked = state.appointments.weekAppointments.some(
        (app) => app.date === dateStr && app.slotTime === slotTime
      );

      if (isSlotBooked) {
        return rejectWithValue('Этот временной слот уже занят другой записью.');
      }

      const docId = buildAppointmentDocId(dateStr, slotTime);
      const docRef = doc(db, 'users', uid, 'appointments', docId);

      const appointmentData = {
        date: dateStr,
        slotTime,
        clientName: formData.clientName.trim(),
        pet: formData.pet.trim(),
        service: formData.service.trim(),
      };

      await setDoc(docRef, {
        ...appointmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const nowIso = new Date().toISOString();

      return {
        ...appointmentData,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
    } catch (error: unknown) {
      console.error('Create appointment error: ', error);
      return rejectWithValue(getErrorMessage(error, 'Не удалось создать запись'));
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setWeekAppointments: (state, action: PayloadAction<FirestoreAppointment[]>) => {
      state.weekAppointments = action.payload;
      state.status = WeekStatusEnum.SUCCEEDED;
      state.error = null;
    },

    setStatus: (state, action: PayloadAction<WeekStatusEnum>) => {
      state.status = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = WeekStatusEnum.FAILED;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.fulfilled, (state, action) => {
        const existingIndex = state.weekAppointments.findIndex(
          (item) => item.id === action.payload.id
        );

        if (existingIndex !== -1) {
          state.weekAppointments[existingIndex] = action.payload;
        } else {
          state.weekAppointments.push(action.payload);
        }

        state.status = WeekStatusEnum.SUCCEEDED;
        state.error = null;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.status = WeekStatusEnum.FAILED;
        // @ts-ignore
        state.error = action.payload ?? action.error.message ?? 'Не удалось создать запись';
      })
      .addCase(logoutAction, (state) => {
        state.weekAppointments = [];
        state.status = WeekStatusEnum.IDLE;
        state.error = null;
      });
  },
});

export default appointmentsSlice.reducer;
