import { FC, memo, useCallback, useMemo } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { DARK_THEME } from '../../constants/theme';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';
import { TabBarItem } from './TabBarItem';

export const TabBar: FC<BottomTabBarProps> = memo(({ state, descriptors, navigation, insets }) => {
  const focusedRoute = state.routes[state.index];
  const focusedOptions = descriptors[focusedRoute.key]?.options;

  const shouldHideOnKeyboard = Boolean(focusedOptions?.tabBarHideOnKeyboard);
  const isKeyboardVisible = useKeyboardVisible(shouldHideOnKeyboard);

  const isHiddenByStyle = useMemo(() => {
    const flattenedStyle = StyleSheet.flatten(focusedOptions?.tabBarStyle);
    return flattenedStyle?.display === 'none';
  }, [focusedOptions?.tabBarStyle]);

  const handleTabPress = useCallback(
    (routeKey: string, routeName: string, isFocused: boolean, routeParams?: object) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName, routeParams);
      }
    },
    [navigation]
  );

  const handleTabLongPress = useCallback(
    (routeKey: string) => {
      navigation.emit({
        type: 'tabLongPress',
        target: routeKey,
      });
    },
    [navigation]
  );

  const containerStyle = useMemo(
    () => [styles.container, { paddingBottom: Math.max(insets.bottom, 8) }],
    [insets.bottom]
  );

  if (isHiddenByStyle || isKeyboardVisible) {
    return null;
  }

  return (
    <View style={containerStyle}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          return (
            <TabBarItem
              key={route.key}
              routeKey={route.key}
              routeName={route.name}
              routeParams={route.params}
              isFocused={isFocused}
              options={options}
              onPress={handleTabPress}
              onLongPress={handleTabLongPress}
            />
          );
        })}
      </View>
    </View>
  );
});

TabBar.displayName = 'TabBar';

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK_THEME.bgSurface,
    borderTopWidth: 1,
    borderTopColor: DARK_THEME.borderStrong,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
