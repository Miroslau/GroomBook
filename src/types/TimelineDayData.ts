import { FirestoreAppointment } from './FirestoreAppointment';

interface TimelineDayData {
  dayAppointmentsMap: Map<string, FirestoreAppointment>;
  bookedTimes: string[];
}

export default TimelineDayData;
