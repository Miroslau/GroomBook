import React, { FC, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { format, isSameDay, isToday } from 'date-fns';
import { DayCell } from './DayCell';

interface WeekPageProps {
  days: Date[];
  selectedDate: Date;
  appointmentsCountMap: Record<string, number>;
  onDateChange: (date: Date) => void;
}

export const WeekPage: FC<WeekPageProps> = memo(
  ({ days, selectedDate, onDateChange, appointmentsCountMap }) => {
    return (
      <View style={styles.weekContainer}>
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');

          return (
            <DayCell
              key={dateStr}
              day={day}
              isSelected={isSameDay(day, selectedDate)}
              isCurrent={isToday(day)}
              appointmentsCount={appointmentsCountMap[dateStr] ?? 0}
              onSelect={onDateChange}
            />
          );
        })}
      </View>
    );
  }
);

WeekPage.displayName = 'WeekPage';

const styles = StyleSheet.create({
  weekContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
});
