import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';
import TimelineDayData from '../../../types/TimelineDayData';
import { FirestoreAppointment } from '../../../types/FirestoreAppointment';

const selectWeekAppointments = (state: RootState) => state.appointments.weekAppointments;

const selectDateParam = (_state: RootState, dateStr: string): string => dateStr;

export const selectAppointmentsCountMap = createSelector(
  [selectWeekAppointments],
  (appointments) => {
    const counts: Record<string, number> = {};

    for (const appointment of appointments) {
      counts[appointment.date] = (counts[appointment.date] ?? 0) + 1;
    }

    return counts;
  }
);

export const selectTimelineDataForDate = createSelector(
  [selectWeekAppointments, selectDateParam],
  (appointments, dateStr): TimelineDayData => {
    const dayAppointmentsMap = new Map<string, FirestoreAppointment>();
    const bookedTimes: string[] = [];

    for (const appointment of appointments) {
      if (appointment.date === dateStr) {
        dayAppointmentsMap.set(appointment.slotTime, appointment);
        bookedTimes.push(appointment.slotTime);
      }
    }

    return { dayAppointmentsMap, bookedTimes };
  }
);
