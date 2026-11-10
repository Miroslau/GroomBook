import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, { useCallback } from 'react';

interface PressableButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  activeScale?: number;
  duration?: number;
  accessibilityLabel: string;
}

const AnimatedPressableButton = Animated.createAnimatedComponent(Pressable);

export const PressableButton: React.FC<PressableButtonProps> = React.memo(
  ({
    children,
    style,
    activeScale = 0.95,
    duration = 100,
    disabled,
    accessibilityLabel,
    onPressIn,
    onPressOut,
    ...restProps
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: withTiming(disabled ? 0.5 : 1, { duration }),
    }));

    const handlePressIn = useCallback(
      (event: GestureResponderEvent) => {
        if (disabled) return;
        scale.value = withTiming(activeScale, { duration });
        if (onPressIn) onPressIn(event);
      },
      [activeScale, duration, disabled, onPressIn, scale]
    );

    const handlePressOut = useCallback(
      (event: GestureResponderEvent) => {
        if (disabled) return;
        scale.value = withTiming(1, { duration });
        if (onPressOut) onPressOut(event);
      },
      [disabled, duration, onPressOut, scale]
    );

    const getContainerStyle = useCallback(
      (state: { pressed: boolean }) => {
        // 1. Разрешаем функцию-стиль, если она передана, или берем объект/массив
        const userStyle = typeof style === 'function' ? style(state) : style;

        // 2. Объединяем базовые стили, стили пользователя и анимированные стили в один плоский объект
        return StyleSheet.flatten([styles.base, userStyle]);
      },
      [style]
    );

    return (
      <AnimatedPressableButton
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[getContainerStyle({ pressed: false }), animatedStyle]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        {...restProps}
      >
        {children}
      </AnimatedPressableButton>
    );
  }
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

PressableButton.displayName = 'PressableButton';
