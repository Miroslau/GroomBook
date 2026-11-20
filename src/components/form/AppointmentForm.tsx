import { AppointmentFormData, appointmentFormSchema } from '../../types/appointmentFormSchema';
import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View, StyleSheet, Text } from 'react-native';
import { FormInput } from './form-input/FormInput';
import { PressableButton } from '../Button/Button';

interface AppointmentFormProps {
  time: string;
  dateStr: string;
  onSubmit: (data: AppointmentFormData) => void;
  isLoading?: boolean;
}

export const AppointmentForm: FC<AppointmentFormProps> = ({
  time,
  dateStr,
  onSubmit,
  isLoading = false,
}) => {
  const { control, handleSubmit } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientName: '',
      pet: '',
      service: '',
    },
  });

  const handleFormSubmit = useCallback(
    (data: AppointmentFormData) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новая запись</Text>
      <Text style={styles.subtitle}>
        Дата: {dateStr} | Время: {time}
      </Text>

      <View style={styles.formFields}>
        <FormInput
          control={control}
          name="clientName"
          label="ФИО Клиента *"
          placeholder="Например, Анна Иванова"
          autoComplete="off"
          autoCorrect={false}
        />

        <FormInput
          control={control}
          name="pet"
          label="Питомец (Порода / Кличка)"
          placeholder="Например, Пудель Коко"
          autoComplete="off"
          autoCorrect={false}
        />

        <FormInput
          control={control}
          name="service"
          label="Услуга"
          placeholder="Например, Комплексный груминг"
          autoComplete="off"
          autoCorrect={false}
        />
      </View>
      <PressableButton
        onPress={handleSubmit(handleFormSubmit)}
        disabled={isLoading}
        accessibilityLabel="Сохранить запись"
        style={styles.submitButton}
        activeScale={0.97}
      >
        <Text style={styles.submitText}>{isLoading ? 'Сохранение...' : 'Создать запись'}</Text>
      </PressableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 10,
    paddingBottom: 20, // Запас снизу, чтобы кнопка не прилипала к клавиатуре
  },
  container: {
    width: '100%',
    paddingTop: 10,
  },
  title: {
    fontFamily: 'Roboto Slab',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D2B52',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Source Sans 3',
    fontSize: 14,
    color: '#5E6E8C',
    textAlign: 'center',
    marginBottom: 24,
  },
  formFields: {
    width: '100%',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1D3A7A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    fontFamily: 'Source Sans 3',
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
