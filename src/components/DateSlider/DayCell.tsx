import { format } from 'date-fns';
import { FC, memo, useCallback, useMemo } from 'react';
import { ru } from 'date-fns/locale';
import { StyleSheet, Text, View } from 'react-native';
import { PressableButton } from '../Button/Button';
import { DARK_THEME } from '../../constants/theme';

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
    paddingVertical: 4,
  },
  dayView: {
    width: 34,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: DARK_THEME.accentPrimary,
  },
  todayButton: {
    borderWidth: 1.5,
    borderColor: DARK_THEME.accentPrimary,
    backgroundColor: DARK_THEME.accentSoft,
  },
  dayOfWeekText: {
    fontFamily: 'Open Sans 3',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    color: DARK_THEME.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dayNumberText: {
    fontFamily: 'Open Sans 3',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: DARK_THEME.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  selectedDayText: {
    color: DARK_THEME.accentPrimary,
  },
  selectedText: {
    color: DARK_THEME.textOnAccent,
  },
  badgeContainer: {
    height: 16,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: DARK_THEME.bgCard,
    borderWidth: 1,
    borderColor: DARK_THEME.accentPrimary,
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 16,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadge: {
    backgroundColor: DARK_THEME.accentSoft,
    borderColor: DARK_THEME.accentPrimary,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: DARK_THEME.accentPrimary,
  },
  selectedBadgeText: {
    color: DARK_THEME.accentPrimary,
  },
});
