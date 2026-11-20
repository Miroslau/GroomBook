import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { addDays, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import PagerView from 'react-native-pager-view';
import { ru } from 'date-fns/locale';
import { PressableButton } from '../Button/Button';
import { CENTER_PAGE_INDEX, useDateSlider, WINDOW_OFFSETS } from '../../hooks/useDateSlider';
import { WeekPage } from './WeekPage';

interface WeekSliderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  appointmentsCountMap?: Record<string, number>;
}

const EMPTY_COUNT_MAP: Record<string, number> = {};

const DateSlider: FC<WeekSliderProps> = memo(
  ({ selectedDate, onDateChange, appointmentsCountMap = EMPTY_COUNT_MAP }) => {
    const { pagerRef, weeks, handlePageSelected, handlePageScrollStateChanged } = useDateSlider({
      selectedDate,
      onDateChange,
    });

    const headerDayLabel = useMemo(
      () => format(selectedDate, 'EEEE', { locale: ru }).toLowerCase(),
      [selectedDate]
    );

    const headerMonthLabel = useMemo(
      () => format(selectedDate, 'LLLL yyyy', { locale: ru }),
      [selectedDate]
    );

    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View>
            <Text style={styles.dayText}>{headerDayLabel}</Text>
            <Text style={styles.monthText}>{headerMonthLabel}</Text>
          </View>
        </View>

        <PagerView
          ref={pagerRef}
          style={styles.week}
          initialPage={CENTER_PAGE_INDEX}
          offscreenPageLimit={2}
          onPageSelected={handlePageSelected}
          onPageScrollStateChanged={handlePageScrollStateChanged}
        >
          {weeks.map((days, index) => (
            <View key={WINDOW_OFFSETS[index]} collapsable={false} style={styles.pageSlot}>
              <WeekPage
                days={days}
                selectedDate={selectedDate}
                appointmentsCountMap={appointmentsCountMap}
                onDateChange={onDateChange}
              />
            </View>
          ))}
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
  pageSlot: {
    flex: 1,
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
    fontWeight: '400',
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
});
