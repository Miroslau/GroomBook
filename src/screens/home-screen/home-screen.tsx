import React, { useCallback, useEffect, useRef, useState } from 'react';
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
} from '../../store/feature/appointment/appointmentsSlice';
import {
  selectAppointmentsCountMap,
  selectTimelineDataForDate,
} from '../../store/feature/appointment/appointmentsSelectors';
import GroomingCard from '../../components/GroomingCard/GroomingCard';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSlot, setActiveSlot] = useState<TimelineSlot | null>(null);
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const appointmentsCountMap = useAppSelector(selectAppointmentsCountMap);
  const { dayAppointmentsMap, bookedTimes } = useAppSelector(selectTimelineDataForDate(dateStr));

  const handleSlotPress = useCallback((slot: TimelineSlot) => {
    setActiveSlot(slot);
    bottomSheetRef.current?.present();
  }, []);

  const handleFormSubmit = useCallback(
    async (formData: any) => {
      console.log('user: ', user);
      console.log('activeSlot: ', activeSlot);
      if (!user || !activeSlot) return;
      const { uid } = user as UserData;
      setIsSubmitting(true);
      try {
        Keyboard.dismiss();
        const slotHour = parseInt(activeSlot.time.split(':')[0], 10);

        await dispatch(
          createAppointment({
            uid,
            dateStr,
            slotHour,
            formData,
          })
        ).unwrap();

        bottomSheetRef.current?.dismiss();
      } catch (error) {
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
    (slot: TimelineSlot) => {
      const hourInt = parseInt(slot.time.split(':')[0], 10);
      const appointmentData = dayAppointmentsMap.get(hourInt);

      return (
        <PressableButton
          onPress={handleSlotPress.bind(this, slot)}
          activeScale={slot.isAvailable ? 0.98 : 0.99}
          accessibilityLabel={`Слот на ${slot.time}. ${slot.isAvailable ? 'Свободно' : 'Занято'}`}
          style={styles.slotPressable}
        >
          {slot.isAvailable ? (
            <Text style={styles.availableText}>Доступно</Text>
          ) : (
            appointmentData && (
              <GroomingCard
                clientName={appointmentData.clientName}
                pet={appointmentData.pet}
                service={appointmentData.service}
              />
            )
          )}
        </PressableButton>
      );
    },
    [dayAppointmentsMap, handleSlotPress]
  );

  useEffect(() => {
    if (user) {
      const { uid } = user as UserData;
      dispatch(subscribeToWeekAppointments({ selectedDate: selectedDate.toDateString(), uid }));
    }
  }, [dispatch, selectedDate, user]);

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
          <Text style={styles.headerText}>SLOT STATUS</Text>
        </View>
      </View>
      <TimeLine bookedTimes={bookedTimes} renderItem={renderSlotContent} />
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
