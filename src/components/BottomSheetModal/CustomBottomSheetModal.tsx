import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { View, StyleSheet } from 'react-native';
export type BottomSheetModalRef = BottomSheetModal;

interface CustomBottomSheetModalProps {
  children: React.ReactNode;
  snapPoints?: string[];
  onDismiss?: () => void;
}

const CustomBottomSheetModal = forwardRef<BottomSheetModalRef, CustomBottomSheetModalProps>(
  ({ children, snapPoints: customSnapPoints, onDismiss }, ref) => {
    const defaultSnapPoints = useMemo(() => ['60%', '90%'], []);
    const resolvedSnapPoints = customSnapPoints || defaultSnapPoints;

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={resolvedSnapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onDismiss={onDismiss}
        backgroundStyle={styles.modalBackground}
        handleIndicatorStyle={styles.handleIndicator}
        enablePanDownToClose={true}
        keyboardBehavior="extend"
        keyboardBlurBehavior="none"
        android_keyboardInputMode="adjustResize"
      >
        <View style={styles.contentContainer}>{children}</View>
      </BottomSheetModal>
    );
  }
);

export default CustomBottomSheetModal;

CustomBottomSheetModal.displayName = 'CustomBottomSheetModal';

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: '#FBF7EC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#DCD2BE',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
