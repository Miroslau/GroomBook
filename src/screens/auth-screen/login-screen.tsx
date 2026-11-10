import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarSvg from '../../components/svg/CalendarSvg';
import CloudSvg from '../../components/svg/CloudSvg';
import ClockSvg from '../../components/svg/ClockSvg';
import IconSvg from '../../components/svg/IconSvg';
import { PressableButton } from '../../components/Button/Button';
import GoogleSvg from '../../components/svg/GoogleSvg';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

const LoginScreen = () => {
  const { signInWithGoogle, isLoggingIn, error } = useGoogleAuth();

  return (
    <SafeAreaView style={styles.viewContainer}>
      <View>
        <Animated.View style={styles.titleWrapper} entering={FadeInUp.duration(600).delay(100)}>
          <View style={styles.titleSquare}>
            <IconSvg />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>DEWAL PRO GROOMING</Text>
            <Text style={styles.h1}>Pet Record Book</Text>
            <Text style={styles.description}>
              Your appointment book, on every page you need, always in sync.
            </Text>
          </View>
        </Animated.View>
        <Animated.View style={styles.listContainer} entering={FadeInUp.duration(600).delay(350)}>
          <View style={styles.listItem}>
            <CalendarSvg />
            <Text style={styles.itemText}>See booked days at a glance in the calendar</Text>
          </View>
          <View style={styles.listItem}>
            <CloudSvg />
            <Text style={styles.itemText}>Works offline, syncs to the cloud automatically</Text>
          </View>
          <View
            style={[
              styles.listItem,
              {
                borderBottomWidth: 1,
                borderBottomColor: '#DCD2BE',
              },
            ]}
          >
            <ClockSvg />
            <Text style={styles.itemText}>Reminders for upcoming appointments</Text>
          </View>
        </Animated.View>
      </View>
      <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.footerContainer}>
        <PressableButton
          onPress={signInWithGoogle}
          accessibilityLabel="Sign in with Google"
          activeScale={0.96}
          duration={120}
          style={styles.loginButton}
          disabled={isLoggingIn}
        >
          <View style={styles.row}>
            {isLoggingIn ? (
              <ActivityIndicator size="small" color="#1D2B52" />
            ) : (
              <>
                <GoogleSvg />
                <Text style={styles.buttonText}>Sign in with Google</Text>
              </>
            )}
          </View>
        </PressableButton>
        <Text style={styles.buttonSubText}>
          Your session stays signed in between launches. Records are stored only for your grooming
          business.
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#F6F0E1',
    paddingVertical: 41,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },

  titleWrapper: {
    paddingHorizontal: 17,
    alignItems: 'center',
  },

  titleSquare: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 88,
    height: 88,
    borderWidth: 2,
    borderColor: '#1D3A7A',
    borderRadius: 4,
    transform: [{ rotate: '-6deg' }],
    marginBottom: 20,
  },
  textWrapper: {
    gap: 10,
  },
  title: {
    fontFamily: 'Source Sans 3',
    fontSize: 12,
    fontWeight: 'regular',
    lineHeight: 16,
    letterSpacing: 2.4,
    color: '#5E6E8C',
    textAlign: 'center',
  },
  h1: {
    fontFamily: 'Roboto Slab',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 36,
    textAlign: 'center',
    color: '#1D2B52',
  },
  description: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: 'regular',
    lineHeight: 24,
    textAlign: 'center',
    color: '#5E6E8C',
  },
  listContainer: {
    paddingTop: 50,
  },
  listItem: {
    borderTopWidth: 1,
    borderTopColor: '#DCD2BE',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  itemText: {
    fontFamily: 'Source Sans 3',
    fontSize: 14,
    fontWeight: 'regular',
    lineHeight: 20,
    color: '#1D2B52',
  },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 4,
    backgroundColor: '#FBF7EC',
    borderWidth: 1,
    borderColor: '#DCD2BE',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  buttonText: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
    color: '#1D2B52',
  },
  buttonSubText: {
    fontFamily: 'Source Sans 3',
    fontSize: 12,
    fontWeight: 'regular',
    lineHeight: 16,
    color: '#5E6E8C',
    textAlign: 'center',
  },
  footerContainer: {
    gap: 12,
  },
});

export default LoginScreen;
