import { FC, memo, useCallback } from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { DARK_THEME } from '../../constants/theme';
import { Text, StyleSheet, View } from 'react-native';
import { PressableButton } from '../Button/Button';

interface TabBarItemProps {
  routeKey: string;
  routeName: string;
  routeParams?: object;
  isFocused: boolean;
  options: BottomTabNavigationOptions;
  onPress: (routeKey: string, routeName: string, isFocused: boolean, routeParams?: object) => void;
  onLongPress: (routeKey: string) => void;
}

const ICON_SIZE = 22;

export const TabBarItem: FC<TabBarItemProps> = memo(
  ({ routeKey, routeName, routeParams, isFocused, options, onPress, onLongPress }) => {
    const handlePress = useCallback(() => {
      onPress(routeKey, routeName, isFocused, routeParams);
    }, [isFocused, onPress, routeKey, routeName, routeParams]);

    const handleLongPress = useCallback(() => {
      onLongPress(routeKey);
    }, [onLongPress, routeKey]);

    const activeColor = options.tabBarActiveTintColor ?? DARK_THEME.accentPrimary;
    const inactiveColor = options.tabBarInactiveTintColor ?? DARK_THEME.textMuted;
    const tintColor = isFocused ? activeColor : inactiveColor;

    const fallbackTitle = options.title ?? routeName;
    const rawLabel = options.tabBarLabel ?? fallbackTitle;

    const renderLabel = () => {
      if (typeof rawLabel === 'function') {
        return rawLabel({
          focused: isFocused,
          color: tintColor,
          position: 'below-icon',
          children: fallbackTitle,
        });
      }

      return (
        <Text
          style={[styles.label, { color: tintColor }, isFocused && styles.labelFocused]}
          numberOfLines={1}
        >
          {rawLabel}
        </Text>
      );
    };

    const hasBadge = options.tabBarBadge !== undefined && options.tabBarBadge !== null;

    return (
      <PressableButton
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel!}
        testID={options.tabBarButtonTestID}
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={({ pressed }) => [styles.itemButton, pressed && styles.itemPressed]}
      >
        <View style={[styles.iconWrapper, isFocused && styles.iconWrapperFocused]}>
          {options.tabBarIcon?.({
            focused: isFocused,
            color: tintColor,
            size: ICON_SIZE,
          })}
          {hasBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{options.tabBarBadge}</Text>
            </View>
          )}
        </View>
        {renderLabel()}
      </PressableButton>
    );
  }
);

TabBarItem.displayName = 'TabBarItem';

const styles = StyleSheet.create({
  itemButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  itemPressed: {
    opacity: 0.75,
  },
  iconWrapper: {
    position: 'relative',
    width: 48,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperFocused: {
    backgroundColor: DARK_THEME.accentSoft,
  },
  label: {
    fontFamily: 'Source Sans 3',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  labelFocused: {
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: 1,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: DARK_THEME.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'Source Sans 3',
    fontSize: 9,
    fontWeight: '700',
    color: DARK_THEME.textOnAccent,
  },
});
