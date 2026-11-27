import React, { ComponentProps, memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { DARK_THEME } from '../../constants/theme';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';

export type FeatureIconName = ComponentProps<typeof Ionicons>['name'];

export interface FeatureItem {
  id: string;
  icon: FeatureIconName;
  iconColor: string;
  iconBg: string;
  text: string;
}

interface FeatureRowProps {
  item: FeatureItem;
  index: number;
  showDivider: boolean;
  disableAnimation?: boolean;
}

const BASE_DELAY_MS = 340;
const STAGGER_STEP_MS = 85;

export const FeatureRow: React.FC<FeatureRowProps> = memo(
  ({ item, index, showDivider, disableAnimation = false }) => {
    const enteringAnimation = useMemo(() => {
      if (disableAnimation) {
        return undefined;
      }

      return FadeInDown.delay(BASE_DELAY_MS + index * STAGGER_STEP_MS)
        .duration(400)
        .easing(Easing.out(Easing.cubic));
    }, [disableAnimation, index]);

    return (
      <Animated.View
        entering={enteringAnimation}
        style={[styles.row, showDivider && styles.rowDivider]}
      >
        <View style={[styles.iconBadge, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon} size={19} color={item.iconColor} />
        </View>
        <Text style={styles.text}>{item.text}</Text>
      </Animated.View>
    );
  }
);

FeatureRow.displayName = 'FeatureRow';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: DARK_THEME.borderSubtle,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontFamily: 'Source Sans 3',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: DARK_THEME.textPrimary,
  },
});
