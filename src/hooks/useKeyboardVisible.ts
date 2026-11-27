import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export const useKeyboardVisible = (enabled: boolean): boolean => {
  const [isKeyboardVisible, setIsKeyBoardVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') {
      return;
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyBoardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyBoardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [enabled]);

  return enabled && Platform.OS === 'android' ? isKeyboardVisible : false;
};
