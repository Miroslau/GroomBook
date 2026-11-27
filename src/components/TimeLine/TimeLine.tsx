import { FC, memo, ReactNode, useCallback, useMemo } from 'react';
import { View, StyleSheet, ListRenderItemInfo, FlatList, Text } from 'react-native';
import { TimelineSlot } from '../../types/TimelineSlot';
import { formatMinutesToTime } from '../../utils/timeUtils';
import { DARK_THEME, LAYOUT } from '../../constants/theme';

interface TimeLineProps {
  startHour?: number;
  endHour?: number;
  stepMinutes?: number;
  bookedTimes: string[];
  renderItem: (slot: TimelineSlot) => ReactNode;
}

export const TimeLine: FC<TimeLineProps> = memo(
  ({ startHour = 9, endHour = 19, stepMinutes = 30, bookedTimes, renderItem }) => {
    const timeLineData = useMemo(() => {
      const data: TimelineSlot[] = [];
      const bookedSet = new Set(bookedTimes);
      const safeStep = stepMinutes > 0 ? stepMinutes : 30;
      const startTotalMinutes = startHour * 60;
      const endTotalMinutes = endHour * 60;

      for (
        let totalMinutes = startTotalMinutes;
        totalMinutes <= endTotalMinutes;
        totalMinutes += safeStep
      ) {
        const timeStr = formatMinutesToTime(totalMinutes);

        data.push({
          id: `slot-${timeStr}`,
          time: timeStr,
          isAvailable: !bookedSet.has(timeStr),
          isHalfHour: totalMinutes % 60 !== 0,
        });
      }

      return data;
    }, [bookedTimes, stepMinutes, startHour, endHour]);

    const renderRow = useCallback(
      ({ item }: ListRenderItemInfo<TimelineSlot>) => {
        return (
          <View style={[styles.rowContainer, item.isHalfHour && styles.halfHourRow]}>
            <View style={styles.timeColumn}>
              <Text
                style={[
                  styles.timeText,
                  item.isHalfHour && styles.halfHourTimeText,
                  !item.isAvailable && styles.bookedTimeText,
                ]}
              >
                {item.time}
              </Text>
            </View>
            <View style={styles.timelineDivider} />
            <View style={styles.contentColumn}>{renderItem(item)}</View>
          </View>
        );
      },
      [renderItem]
    );

    const getItemLayout = useCallback(
      (_data: ArrayLike<TimelineSlot> | null | undefined, index: number) => ({
        length: LAYOUT.slotHeight,
        offset: LAYOUT.slotHeight * index,
        index,
      }),
      []
    );

    const keyExtractor = useCallback((item: TimelineSlot) => item.id, []);

    return (
      <View style={styles.container}>
        <FlatList
          data={timeLineData}
          renderItem={renderRow}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
);

TimeLine.displayName = 'TimeLine';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_THEME.bgBase,
  },
  listContent: {
    paddingBottom: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    height: LAYOUT.slotHeight,
    backgroundColor: DARK_THEME.bgBase,
    borderBottomWidth: 1,
    borderBottomColor: DARK_THEME.borderStrong,
  },
  halfHourRow: {
    borderBottomColor: DARK_THEME.borderSubtle,
  },
  timeColumn: {
    width: LAYOUT.timeColumnWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Source Sans 3',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    color: DARK_THEME.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  halfHourTimeText: {
    fontSize: 13,
    fontWeight: '500',
    color: DARK_THEME.textMuted,
  },
  bookedTimeText: {
    color: DARK_THEME.accentPrimary,
  },
  timelineDivider: {
    width: LAYOUT.dividerWidth,
    backgroundColor: DARK_THEME.dividerAccent,
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'center',
  },
});
