import { FC, memo, ReactNode, useCallback, useMemo } from 'react';
import { View, StyleSheet, ListRenderItemInfo, FlatList, Text } from 'react-native';
import { TimelineSlot } from '../../types/TimelineSlot';
import { formatMinutesToTime } from '../../utils/timeUtils';

interface TimeLineProps {
  startHour?: number;
  endHour?: number;
  stepMinutes?: number;
  bookedTimes: string[];
  renderItem: (slot: TimelineSlot) => ReactNode;
}

const SLOT_HEIGHT = 80;

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
          <View
            style={[
              styles.rowContainer,
              item.isAvailable && styles.availableRow,
              item.isHalfHour && styles.halfHourRow,
            ]}
          >
            <View style={styles.timeColumn}>
              <Text style={[styles.timeText, item.isHalfHour && styles.halfHourTimeText]}>
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
        length: SLOT_HEIGHT,
        offset: SLOT_HEIGHT * index,
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
    backgroundColor: '#FBF7EC',
  },
  rowContainer: {
    flexDirection: 'row',
    height: SLOT_HEIGHT,
    backgroundColor: '#FFF8E7', // Фон для занятого слота
    borderBottomWidth: 1,
    borderBottomColor: '#DCD2BE',
  },
  availableRow: {
    backgroundColor: '#FBF7EC', // Фон для свободного Available слота
  },
  halfHourRow: {
    borderBottomColor: '#E8E0CE',
  },
  timeColumn: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
    color: '#1D2B52',
  },
  timelineDivider: {
    width: 2,
    backgroundColor: '#E6A53B',
  },
  halfHourTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5E6E8C',
  },
  contentColumn: {
    flex: 1,
    //paddingHorizontal: 16,
    //justifyContent: 'center',
  },
});
