import PagerView, { PagerViewProps } from 'react-native-pager-view';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { addDays, addWeeks, differenceInCalendarWeeks, isSameWeek, startOfWeek } from 'date-fns';

export const WINDOW_OFFSETS = [-2, -1, 0, 1, 2] as const;
export const CENTER_PAGE_INDEX = 2;

type PageSelectedEvent = Parameters<NonNullable<PagerViewProps['onPageSelected']>>[0];
type PageScrollStateEvent = Parameters<NonNullable<PagerViewProps['onPageScrollStateChanged']>>[0];

interface UseDateSliderParams {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const useDateSlider = ({ selectedDate, onDateChange }: UseDateSliderParams) => {
  const pagerRef = useRef<PagerView>(null);

  const [anchorWeekStart, setAnchorWeekStart] = useState<Date>(() =>
    startOfWeek(selectedDate, { weekStartsOn: 1 })
  );

  const pagePositionRef = useRef<number>(CENTER_PAGE_INDEX);
  const needsRecenterRef = useRef<boolean>(false);
  const isRecenteringRef = useRef<boolean>(false);

  const weeks = useMemo<Date[][]>(() => {
    return WINDOW_OFFSETS.map((offset) => {
      const weekStart = addWeeks(anchorWeekStart, offset);
      return Array.from({ length: 7 }, (_, dayIndex) => addDays(weekStart, dayIndex));
    });
  }, [anchorWeekStart]);

  const handlePageSelected = useCallback(
    (event: PageSelectedEvent) => {
      const newPage = event.nativeEvent.position;

      if (isRecenteringRef.current && newPage === CENTER_PAGE_INDEX) {
        isRecenteringRef.current = false;
        return;
      }

      isRecenteringRef.current = false;
      pagePositionRef.current = newPage;

      const weekOffset = newPage - CENTER_PAGE_INDEX;
      const targetWeekStart = addWeeks(anchorWeekStart, weekOffset);

      if (!isSameWeek(selectedDate, targetWeekStart, { weekStartsOn: 1 })) {
        const dayOfWeekIndex = (selectedDate.getDay() + 6) % 7;
        onDateChange(addDays(targetWeekStart, dayOfWeekIndex));
      }
    },
    [anchorWeekStart, onDateChange, selectedDate]
  );

  const handlePageScrollStateChanged = useCallback((event: PageScrollStateEvent) => {
    const { pageScrollState } = event.nativeEvent;

    if (pageScrollState !== 'idle') {
      return;
    }

    const deltaWeeks = pagePositionRef.current - CENTER_PAGE_INDEX;
    if (deltaWeeks === 0) {
      return;
    }

    needsRecenterRef.current = true;
    setAnchorWeekStart((prev) => addWeeks(prev, deltaWeeks));
  }, []);

  useEffect(() => {
    const diffWeeks = differenceInCalendarWeeks(selectedDate, anchorWeekStart, {
      weekStartsOn: 1,
    });
    const currentOffset = pagePositionRef.current - CENTER_PAGE_INDEX;

    if (diffWeeks === currentOffset) {
      return;
    }

    const targetPage = CENTER_PAGE_INDEX + diffWeeks;

    if (targetPage >= 1 && targetPage <= 3) {
      pagePositionRef.current = targetPage;
      pagerRef.current?.setPage(targetPage);
    }

    needsRecenterRef.current = pagePositionRef.current !== CENTER_PAGE_INDEX;
    setAnchorWeekStart(startOfWeek(selectedDate, { weekStartsOn: 1 }));
  }, [anchorWeekStart, selectedDate]);

  useLayoutEffect(() => {
    if (!needsRecenterRef.current) {
      return;
    }

    needsRecenterRef.current = false;
    isRecenteringRef.current = true;
    pagePositionRef.current = CENTER_PAGE_INDEX;
    pagerRef.current?.setPageWithoutAnimation(CENTER_PAGE_INDEX);
  }, [anchorWeekStart]);

  return {
    pagerRef,
    weeks,
    handlePageSelected,
    handlePageScrollStateChanged,
  };
};
