import { format } from 'date-fns';
import { FC, memo, useCallback, useMemo } from 'react';
import { ru } from 'date-fns/locale';
import { StyleSheet, Text, View } from 'react-native';
import { PressableButton } from '../Button/Button';

interface DayCellProps {
  day: Date;
  isSelected: boolean;
  isCurrent: boolean;
  appointmentsCount: number;
  onSelect: (day: Date) => void;
}

export const DayCell: FC<DayCellProps> = memo(
  ({ day, isCurrent, isSelected, appointmentsCount, onSelect }) => {
    const handlePress = useCallback(() => {
      onSelect(day);
    }, [day, onSelect]);

    const dayOfWeekLabel = useMemo(() => format(day, 'eeeeee', { locale: ru }), [day]);
    const accessibilityLabel = useMemo(() => format(day, 'EEEE, d MMMM', { locale: ru }), [day]);

    return (
      <PressableButton
        onPress={handlePress}
        style={styles.dayButton}
        accessibilityLabel={accessibilityLabel}
      >
        <Text style={[styles.dayOfWeekText, isSelected && styles.selectedDayText]}>
          {dayOfWeekLabel}
        </Text>
        <View
          style={[
            styles.dayView,
            isSelected && styles.selectedDayButton,
            isCurrent && !isSelected && styles.todayButton,
          ]}
        >
          <Text style={[styles.dayNumberText, isSelected && styles.selectedText]}>
            {day.getDate()}
          </Text>
        </View>

        <View style={styles.badgeContainer}>
          {appointmentsCount > 0 && (
            <View style={[styles.badge, isSelected && styles.selectedBadge]}>
              <Text style={[styles.badgeText, isSelected && styles.selectedBadgeText]}>
                {appointmentsCount}
              </Text>
            </View>
          )}
        </View>
      </PressableButton>
    );
  }
);

DayCell.displayName = 'DayCell';

const styles = StyleSheet.create({
  dayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayView: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  selectedDayButton: {
    backgroundColor: '#1D3A7A',
  },
  todayButton: {
    borderWidth: 1,
    borderColor: '#1D3A7A',
  },
  dayOfWeekText: {
    fontFamily: 'Open Sans 3',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#5E6E8C',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dayNumberText: {
    fontFamily: 'Open Sans 3',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    color: '#1D2B52',
  },
  selectedDayText: {
    color: '#1D3A7A',
  },
  selectedText: {
    color: '#FFF',
  },
  badgeContainer: {
    height: 14,
    marginTop: 2,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#E6A53B',
    borderRadius: 6,
    paddingHorizontal: 5,
    minWidth: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadge: {
    backgroundColor: '#FFF',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFF',
  },
  selectedBadgeText: {
    color: '#1D3A7A',
  },
});
