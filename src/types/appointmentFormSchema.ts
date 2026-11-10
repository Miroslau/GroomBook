import { z } from 'zod';

export const appointmentFormSchema = z.object({
  clientName: z
    .string()
    .min(1, 'Имя клиента обязательно')
    .max(100, 'Имя не должно превышать 100 символов'),
  pet: z.string().max(100, 'Описание питомца не должно превышать 100 символов'),
  service: z.string().max(100, 'Название услуги не должно превышать 100 символов'),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
