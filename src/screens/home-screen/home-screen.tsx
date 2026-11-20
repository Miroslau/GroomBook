import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, View, Keyboard } from 'react-native';
import { PressableButton } from '../../components/Button/Button';
import { auth } from '../../utils/firebaseConfig';
import { signOut } from 'firebase/auth';
import DateSlider from '../../components/DateSlider/DateSlider';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { TimeLine } from '../../components/TimeLine/TimeLine';
import { TimelineSlot } from '../../types/TimelineSlot';
import CustomBottomSheetModal, {
  BottomSheetModalRef,
} from '../../components/BottomSheetModal/CustomBottomSheetModal';
import { AppointmentForm } from '../../components/form/AppointmentForm';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppSelector } from '../../store/store';
import { UserData } from '../../store/feature/auth/authSlice';
import {
  createAppointment,
  subscribeToWeekAppointments,
  unsubscribeFromAppointments,
} from '../../store/feature/appointment/appointmentsSlice';
import {
  selectAppointmentsCountMap,
  selectTimelineDataForDate,
} from '../../store/feature/appointment/appointmentsSelectors';
import GroomingCard from '../../components/GroomingCard/GroomingCard';
import { AppointmentFormData } from '../../types/appointmentFormSchema';
import { TimelineSlotItem } from '../../components/TimeLine/TimelineSlotItem';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSlot, setActiveSlot] = useState<TimelineSlot | null>(null);
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const dateStr = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);
  const weekStartDate = useMemo(
    () => format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    [selectedDate]
  );

  const appointmentsCountMap = useAppSelector(selectAppointmentsCountMap);
  const { dayAppointmentsMap, bookedTimes } = useAppSelector((state) =>
    selectTimelineDataForDate(state, dateStr)
  );

  const handleSlotPress = useCallback((slot: TimelineSlot) => {
    setActiveSlot(slot);
    bottomSheetRef.current?.present();
  }, []);

  const handleFormSubmit = useCallback(
    async (formData: AppointmentFormData) => {
      if (!user || !activeSlot) return;
      const { uid } = user as UserData;
      setIsSubmitting(true);
      try {
        Keyboard.dismiss();

        await dispatch(
          createAppointment({
            uid,
            dateStr,
            slotTime: activeSlot.time,
            formData,
          })
        ).unwrap();

        bottomSheetRef.current?.dismiss();
      } catch (error: unknown) {
      } finally {
        setIsSubmitting(false);
      }
    },
    [activeSlot, dateStr, dispatch, user]
  );

  const handleModalDismiss = useCallback(() => {
    setActiveSlot(null);
  }, []);

  const handleLogOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const renderSlotContent = useCallback(
    (slot: TimelineSlot) => (
      <TimelineSlotItem
        slot={slot}
        appointment={dayAppointmentsMap.get(slot.time)}
        onPress={handleSlotPress}
      />
    ),
    [dayAppointmentsMap, handleSlotPress]
  );

  useEffect(() => {
    if (!user?.uid) return;

    dispatch(subscribeToWeekAppointments({ weekStartDate, uid: user.uid }));

    return () => {
      dispatch(unsubscribeFromAppointments());
    };
  }, [dispatch, weekStartDate, user?.uid]);

  return (
    <SafeAreaView style={styles.container}>
      <DateSlider
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        appointmentsCountMap={appointmentsCountMap}
      />
      <View style={styles.tableHeader}>
        <View style={styles.timeColumn}>
          <Text style={styles.headerText}>ВРЕМЯ</Text>
        </View>
        <View style={styles.timelineDivider} />
        <View style={styles.contentColumn}>
          <Text style={styles.headerText}>СТАТУС СЛОТА</Text>
        </View>
      </View>
      <TimeLine
        startHour={9}
        endHour={19}
        stepMinutes={30}
        bookedTimes={bookedTimes}
        renderItem={renderSlotContent}
      />
      <CustomBottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['60%', '90%']}
        onDismiss={handleModalDismiss}
      >
        {activeSlot && (
          <AppointmentForm
            time={activeSlot.time}
            dateStr={dateStr}
            isLoading={isSubmitting}
            onSubmit={handleFormSubmit}
          />
        )}
      </CustomBottomSheetModal>
      {/*<PressableButton
        accessibilityLabel="Выйти из аккаунта"
        style={styles.logoutButton}
        onPress={handleLogOut}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </PressableButton>*/}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F0E1',
  },
  tableHeader: {
    flexDirection: 'row',
    height: 34,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCD2BE',
  },
  headerText: {
    fontFamily: 'Source Sans 3',
    fontSize: 11,
    fontWeight: '600',
    color: '#7E8A9F',
    letterSpacing: 0.5,
  },
  timeColumn: {
    width: 74,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDivider: {
    width: 2,
    height: 34,
    backgroundColor: '#E6A53B',
  },
  contentColumn: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  nameText: { fontSize: 20, fontWeight: 'bold', color: '#1D2B52' },
  emailText: { fontSize: 14, color: '#5E6E8C', marginBottom: 30 },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
  availableText: {
    fontFamily: 'Source Sans 3',
    fontSize: 14,
    lineHeight: 20,
    color: '#5E6E8C',
  },
  slotPressable: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  modalContent: { paddingTop: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1D2B52', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#5E6E8C' },
});
