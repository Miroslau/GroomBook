import { TimelineSlot } from '../../types/TimelineSlot';
import { FirestoreAppointment } from '../../types/FirestoreAppointment';
import { FC, memo, useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
import { PressableButton } from '../Button/Button';
import GroomingCard from '../GroomingCard/GroomingCard';

interface TimelineSlotItemProps {
  slot: TimelineSlot;
  appointment?: FirestoreAppointment;
  onPress: (slot: TimelineSlot) => void;
}

export const TimelineSlotItem: FC<TimelineSlotItemProps> = memo(
  ({ slot, appointment, onPress }) => {
    const handlePress = useCallback(() => {
      onPress(slot);
    }, [onPress, slot]);

    return (
      <PressableButton
        onPress={handlePress}
        activeScale={slot.isAvailable ? 0.98 : 0.99}
        accessibilityLabel={`Слот на ${slot.time}. ${slot.isAvailable ? 'Свободно' : 'Занято'}`}
        style={styles.slotPressable}
      >
        {slot.isAvailable ? (
          <Text style={styles.availableText}>Доступно</Text>
        ) : (
          appointment && (
            <GroomingCard
              clientName={appointment.clientName}
              pet={appointment.pet}
              service={appointment.service}
            />
          )
        )}
      </PressableButton>
    );
  }
);

TimelineSlotItem.displayName = 'TimelineSlotItem';

const styles = StyleSheet.create({
  availableText: {
    fontFamily: 'Source Sans 3',
    fontSize: 14,
    lineHeight: 20,
    color: '#5E6E8C',
  },
  slotPressable: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
});
