import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { addDays, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import PagerView from 'react-native-pager-view';
import { ru } from 'date-fns/locale';
import { PressableButton } from '../Button/Button';

const INITIAL_INDEX = 500;

interface WeekSliderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  appointmentsCountMap?: Record<string, number>;
}

const DateSlider: FC<WeekSliderProps> = memo(
  ({ selectedDate, onDateChange, appointmentsCountMap = {} }) => {
    const pagerRef = useRef<PagerView>(null);

    const [currentPage, setCurrentPage] = useState(INITIAL_INDEX);

    const currentWeekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);

    const getWeekDays = useCallback(
      (pageIndex: number): Date[] => {
        const weekOffset = pageIndex - INITIAL_INDEX;
        const weekStart = addDays(currentWeekStart, weekOffset * 7);

        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      },
      [currentWeekStart]
    );

    const handlePageSelected = useCallback(
      (event: { nativeEvent: { position: number } }) => {
        const newPage = event.nativeEvent.position;
        setCurrentPage(newPage);

        const weekDays = getWeekDays(newPage);
        const isSelectedDateInWeek = weekDays.some((day) => isSameDay(day, selectedDate));

        if (!isSelectedDateInWeek) {
          const currentDayIdx = (selectedDate.getDay() + 6) % 7;
          onDateChange(weekDays[currentDayIdx]);
        }
      },
      [getWeekDays, onDateChange, selectedDate]
    );

    useEffect(() => {
      const selectedWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const diffInWeeks = Math.round(
        (selectedWeekStart.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );

      const targetPage = INITIAL_INDEX + diffInWeeks;

      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
        pagerRef.current?.setPage(targetPage);
      }
    }, [currentPage, currentWeekStart, selectedDate]);

    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View>
            <Text style={styles.dayText}>
              {format(selectedDate, 'EEEE', { locale: ru }).toUpperCase()}
            </Text>
            <Text style={styles.monthText}>
              {format(selectedDate, 'LLLL yyyy', { locale: ru })}
            </Text>
          </View>
          {/*<PressableButton
            onPress={() => onDateChange(new Date())}
            accessibilityLabel="Today"
            style={styles.todayLabelButton}
          >
            <Text style={styles.todayLabelText}>Today</Text>
          </PressableButton>*/}
        </View>
        <PagerView
          ref={pagerRef}
          style={styles.week}
          initialPage={INITIAL_INDEX}
          onPageSelected={handlePageSelected}
        >
          {Array.from({ length: 1000 }).map((_, pageIdx) => {
            const isFar = Math.abs(pageIdx - currentPage) > 1;
            if (isFar) {
              return <View key={pageIdx} style={styles.weekContainer} />;
            }

            const days = getWeekDays(pageIdx);

            return (
              <View key={pageIdx} style={styles.weekContainer}>
                {days.map((day) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrent = isToday(day);
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const count = appointmentsCountMap[dateStr] || 0;

                  return (
                    <PressableButton
                      key={dateStr}
                      onPress={() => onDateChange(day)}
                      accessibilityLabel={format(day, 'EEEE, d MMMM', { locale: ru })}
                      style={styles.dayButton}
                    >
                      <Text style={[styles.dayOfWeekText, isSelected && styles.selectedDayText]}>
                        {format(day, 'eeeeee', { locale: ru })}
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
                        {count > 0 && (
                          <View style={[styles.badge, isSelected && styles.selectedBadge]}>
                            <Text
                              style={[styles.badgeText, isSelected && styles.selectedBadgeText]}
                            >
                              {count}
                            </Text>
                          </View>
                        )}
                      </View>
                    </PressableButton>
                  );
                })}
              </View>
            );
          })}
        </PagerView>
      </View>
    );
  }
);

DateSlider.displayName = 'DateSlider';

export default DateSlider;

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 12,
  },
  week: {
    height: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dayText: {
    fontFamily: 'Open Sans 3',
    fontSize: 12,
    fontWeight: 'regular',
    lineHeight: 16,
    letterSpacing: 0.6,
    color: '#5E6E8C',
  },
  monthText: {
    fontFamily: 'Roboto Slab',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    color: '#1D2B52',
    textTransform: 'capitalize',
  },
  todayLabelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#1D3A7A',
  },
  todayLabelText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  dayButton: {
    width: (Dimensions.get('window').width - 32) / 7,
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
    fontWeight: 'regular',
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
