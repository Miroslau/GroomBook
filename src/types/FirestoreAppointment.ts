export interface FirestoreAppointment {
  id?: string;
  date: string;
  slotTime: string;
  slotHour?: number;
  clientName: string;
  pet: string;
  service: string;
  createdAt: string;
  updatedAt: string;
}
