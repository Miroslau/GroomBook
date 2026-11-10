import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Text, TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface FormInputProps<TFieldValues extends FieldValues> extends TextInputProps {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
}

export const FormInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  style,
  ...textInputProps
}: FormInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <BottomSheetTextInput
            style={[styles.input, error && styles.inputError, style]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor="#A4A9B5"
            {...textInputProps}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Source Sans 3',
    fontSize: 14,
    fontWeight: '600',
    color: '#5E6E8C',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DCD2BE',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1D2B52',
    fontFamily: 'Source Sans 3',
  },
  inputError: {
    borderColor: '#E25C47', // Красный цвет ошибки
  },
  errorText: {
    fontFamily: 'Source Sans 3',
    fontSize: 12,
    color: '#E25C47',
    marginTop: 4,
  },
});
