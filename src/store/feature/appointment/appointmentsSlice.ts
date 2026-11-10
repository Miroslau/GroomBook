import { FirestoreAppointment } from '../../../types/FirestoreAppointment';
import { WeekStatusEnum } from '../../../enums/weekStatus';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { endOfWeek, format, startOfWeek } from 'date-fns';
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

interface CreateAppointmentPayload {
  uid: string;
  dateStr: string;
  slotHour: number;
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

export const subscribeToWeekAppointments = createAsyncThunk(
  'appointments/subscribeToWeek',
  async ({ selectedDate, uid }: { selectedDate: string; uid: string }, { dispatch }) => {
    if (unsubscribeTimeLine) {
      unsubscribeTimeLine();
      unsubscribeTimeLine = null;
    }

    dispatch(appointmentsSlice.actions.setStatus(WeekStatusEnum.LOADING));

    const parsedDate = new Date(selectedDate);
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
          const appointmentsData: FirestoreAppointment[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            const createdAtIso = data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : new Date().toISOString();

            const updatedAtIso = data.updatedAt?.toDate
              ? data.updatedAt.toDate().toISOString()
              : new Date().toISOString();
            appointmentsData.push({
              ...data,
              id: doc.id,
              createdAt: createdAtIso,
              updatedAt: updatedAtIso,
            } as FirestoreAppointment);
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

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (
    { uid, dateStr, slotHour, formData }: CreateAppointmentPayload,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;

      const isSlotBooked = state.appointments.weekAppointments.some(
        (app) => app.date === dateStr && app.slotHour === slotHour
      );

      if (isSlotBooked) {
        return rejectWithValue('Этот временной слот уже занят другой записью.');
      }

      const trimmedClientName = formData.clientName.trim();
      const trimmedPet = formData.pet.trim();
      const trimmedService = formData.service.trim();

      const docId = `${dateStr}_${slotHour}`;
      const docRef = doc(db, 'users', uid, 'appointments', docId);

      const appointmentData = {
        date: dateStr,
        slotHour,
        clientName: trimmedClientName,
        pet: trimmedPet,
        service: trimmedService,
      };

      await setDoc(docRef, {
        ...appointmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return {
        ...appointmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as FirestoreAppointment;
    } catch (error: any) {
      console.error('error: ', error);
      return rejectWithValue(error.message);
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
        state.weekAppointments.push(action.payload);
        state.status = WeekStatusEnum.SUCCEEDED;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.status = WeekStatusEnum.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const { setWeekAppointments } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
