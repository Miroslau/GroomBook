export const formatMinutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const normalizeSlotTime = (slotTime?: string, slotHour?: number): string => {
  if (slotTime) {
    return slotTime;
  }

  if (typeof slotHour === 'number') {
    return `${slotHour.toString().padStart(2, '0')}:00`;
  }

  return '00:00';
};

export const buildAppointmentDocId = (dateStr: string, slotTime: string): string => {
  return `${dateStr}_${slotTime.replace(':', '-')}`;
};

export const getErrorMessage = (
  error: unknown,
  fallback = 'Произошла неизвестная ошибка'
): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
