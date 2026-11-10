import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';

const selectWeekAppointments = (state: RootState) => state.appointments.weekAppointments;

export const selectAppointmentsCountMap = createSelector(
  [selectWeekAppointments],
  (appointments) => {
    const counts: Record<string, number> = {};

    appointments.forEach((appointment) => {
      counts[appointment.date] = (counts[appointment.date] || 0) + 1;
    });

    return counts;
  }
);

export const selectTimelineDataForDate = (dateStr: string) =>
  createSelector([selectWeekAppointments], (appointments) => {
    const dayMap = new Map<number, any>();
    const bookedTimes: string[] = [];

    appointments.forEach((app) => {
      if (app.date === dateStr) {
        dayMap.set(app.slotHour, app);
        bookedTimes.push(`${app.slotHour.toString().padStart(2, '0')}:00`);
      }
    });

    return { dayAppointmentsMap: dayMap, bookedTimes };
  });
