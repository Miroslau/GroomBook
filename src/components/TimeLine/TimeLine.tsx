import { FC, memo, ReactNode, useCallback, useMemo } from 'react';
import { View, StyleSheet, ListRenderItemInfo, FlatList, Text } from 'react-native';
import { TimelineSlot } from '../../types/TimelineSlot';

interface TimeLineProps {
  startHour?: number;
  endHour?: number;
  bookedTimes: string[];
  renderItem: (slot: TimelineSlot) => ReactNode;
}

const SLOT_HEIGHT = 80;

export const TimeLine: FC<TimeLineProps> = memo(
  ({ startHour = 9, endHour = 19, bookedTimes, renderItem }) => {
    const timeLineData = useMemo(() => {
      const data: TimelineSlot[] = [];
      const bookedSet = new Set(bookedTimes);

      for (let hour = startHour; hour <= endHour; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;

        data.push({
          id: `slot-${timeStr}`,
          time: timeStr,
          isAvailable: !bookedSet.has(timeStr),
        });
      }

      return data;
    }, [startHour, endHour, bookedTimes]);

    const renderRow = useCallback(
      ({ item }: ListRenderItemInfo<TimelineSlot>) => {
        return (
          <View style={[styles.rowContainer, item.isAvailable && styles.availableRow]}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.timelineDivider} />
            <View style={styles.contentColumn}>{renderItem(item)}</View>
          </View>
        );
      },
      [renderItem]
    );

    const getItemLayout = useCallback(
      (_: any, index: number) => ({
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
          maxToRenderPerBatch={endHour - startHour + 1}
          windowSize={3}
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
  contentColumn: {
    flex: 1,
    //paddingHorizontal: 16,
    //justifyContent: 'center',
  },
});
