import React, { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { DARK_THEME } from '../../constants/theme';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const FINAL_ROTATION_DEG = -6;
const FLOAT_OFFSET_PX = -5;

export const BrandEmblem: React.FC = memo(() => {
  const isReducedMotion = useReducedMotion();

  const opacity = useSharedValue<number>(isReducedMotion ? 1 : 0);
  const scale = useSharedValue<number>(isReducedMotion ? 1 : 0.82);
  const rotation = useSharedValue<number>(isReducedMotion ? FINAL_ROTATION_DEG : -14);
  const floatY = useSharedValue<number>(0);

  const animatedFrameStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: floatY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  useEffect(() => {
    if (isReducedMotion) {
      opacity.value = 1;
      scale.value = 1;
      rotation.value = FINAL_ROTATION_DEG;
      floatY.value = 0;
      return;
    }

    opacity.value = withTiming(1, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });

    scale.value = withSpring(1, {
      damping: 14,
      stiffness: 150,
    });

    rotation.value = withSpring(FINAL_ROTATION_DEG, {
      damping: 14,
      stiffness: 130,
    });

    floatY.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(FLOAT_OFFSET_PX, {
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(scale);
      cancelAnimation(rotation);
      cancelAnimation(floatY);
    };
  }, [floatY, isReducedMotion, opacity, rotation, scale]);

  return (
    <Animated.View style={[styles.outerFrame, animatedFrameStyle]}>
      <View style={styles.innerGlow}>
        <Ionicons name="paw-outline" size={44} color={DARK_THEME.accentPrimary} />
      </View>
    </Animated.View>
  );
});

BrandEmblem.displayName = 'BrandEmblem';

const styles = StyleSheet.create({
  outerFrame: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: DARK_THEME.bgCard,
    borderWidth: 1.5,
    borderColor: DARK_THEME.dividerAccent,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  innerGlow: {
    width: 66,
    height: 66,
    borderRadius: 14,
    backgroundColor: DARK_THEME.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
