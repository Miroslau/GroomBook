import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableButton } from '../../components/Button/Button';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { FeatureItem, FeatureRow } from '../../components/FeatureRow/FeatureRow';
import { DARK_THEME } from '../../constants/theme';
import { BrandEmblem } from '../../components/svg/BrandEmblemSVG';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOutUp,
  LinearTransition,
  useReducedMotion,
} from 'react-native-reanimated';

const FEATURES: readonly FeatureItem[] = [
  {
    id: 'calendar',
    icon: 'calendar-outline',
    iconColor: DARK_THEME.statusConfirmedText,
    iconBg: DARK_THEME.statusConfirmedBg,
    text: 'Загруженные дни сразу видны в календаре',
  },
  {
    id: 'offline-sync',
    icon: 'cloud-done-outline',
    iconColor: DARK_THEME.infoText,
    iconBg: DARK_THEME.infoBg,
    text: 'Работает офлайн и сам синхронизируется с облаком',
  },
  {
    id: 'reminders',
    icon: 'notifications-outline',
    iconColor: DARK_THEME.accentPrimary,
    iconBg: DARK_THEME.accentSoft,
    text: 'Напоминания о предстоящих записях',
  },
];

const SMOOTH_EASE = Easing.out(Easing.cubic);

const EYEBROW_ENTERING = FadeInDown.delay(100).duration(380).easing(SMOOTH_EASE);
const TITLE_ENTERING = FadeInDown.delay(170).duration(420).easing(SMOOTH_EASE);
const SUBTITLE_ENTERING = FadeInDown.delay(240).duration(420).easing(SMOOTH_EASE);
const FEATURES_CARD_ENTERING = FadeInDown.delay(300).duration(420).easing(SMOOTH_EASE);
const BOTTOM_SECTION_ENTERING = FadeInUp.delay(520).duration(440).easing(SMOOTH_EASE);

const ERROR_ENTERING = FadeInUp.duration(240).easing(SMOOTH_EASE);
const ERROR_EXITING = FadeOutUp.duration(180);
const SMOOTH_LAYOUT = LinearTransition.duration(220).easing(SMOOTH_EASE);

const LoginScreen = () => {
  const { signInWithGoogle, clearError, isLoggingIn, error } = useGoogleAuth();

  const isReducedMotion = useReducedMotion();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.heroSection}>
          <BrandEmblem />

          <Animated.Text
            entering={isReducedMotion ? undefined : EYEBROW_ENTERING}
            style={styles.eyebrow}
          >
            ГРУМИНГ-ЖУРНАЛ
          </Animated.Text>
          <Animated.Text
            entering={isReducedMotion ? undefined : TITLE_ENTERING}
            style={styles.title}
          >
            Groom Book
          </Animated.Text>
          <Animated.Text
            entering={isReducedMotion ? undefined : SUBTITLE_ENTERING}
            style={styles.subtitle}
          >
            Ваша книга записей клиентов — всегда под рукой и в синхронизации.
          </Animated.Text>
        </View>

        <Animated.View
          entering={isReducedMotion ? undefined : FEATURES_CARD_ENTERING}
          style={styles.featuresCard}
        >
          {FEATURES.map((item, index) => (
            <FeatureRow
              key={item.id}
              item={item}
              index={index}
              showDivider={index < FEATURES.length - 1}
              disableAnimation={isReducedMotion}
            />
          ))}
        </Animated.View>

        <Animated.View
          style={styles.bottomSection}
          entering={isReducedMotion ? undefined : BOTTOM_SECTION_ENTERING}
          layout={isReducedMotion ? undefined : SMOOTH_LAYOUT}
        >
          {Boolean(error) && (
            <Animated.View
              entering={isReducedMotion ? undefined : ERROR_ENTERING}
              exiting={isReducedMotion ? undefined : ERROR_EXITING}
              style={styles.errorBanner}
              accessibilityRole="alert"
            >
              <Ionicons name="alert-circle-outline" size={18} color={DARK_THEME.dangerText} />
              <Text style={styles.errorText}>{error}</Text>
              <PressableButton
                onPress={clearError}
                accessibilityLabel="Скрыть сообщение об ошибке"
                style={styles.errorCloseButton}
              >
                <Ionicons name="close" size={16} color={DARK_THEME.dangerText} />
              </PressableButton>
            </Animated.View>
          )}

          <PressableButton
            onPress={signInWithGoogle}
            disabled={isLoggingIn}
            accessibilityLabel="Войти через Google"
            activeScale={0.98}
            style={[styles.googleButton, isLoggingIn && styles.googleButtonDisabled]}
          >
            <View style={styles.googleButtonContent}>
              {isLoggingIn ? (
                <ActivityIndicator size="small" color={DARK_THEME.textOnAccent} />
              ) : (
                <Ionicons name="logo-google" size={20} color={DARK_THEME.textOnAccent} />
              )}
              <Text style={styles.googleButtonText}>
                {isLoggingIn ? 'Выполняется вход...' : 'Войти через Google'}
              </Text>
            </View>
          </PressableButton>

          <Text style={styles.disclaimer}>
            Сессия сохраняется между запусками. Все записи хранятся только в вашем аккаунте.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_THEME.bgBase,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 20,
    gap: 28,
  },
  heroSection: {
    alignItems: 'center',
  },
  eyebrow: {
    marginTop: 26,
    fontFamily: 'Source Sans 3',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: DARK_THEME.accentPrimary,
    textAlign: 'center',
  },
  title: {
    marginTop: 8,
    fontFamily: 'Roboto Slab',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
    color: DARK_THEME.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    maxWidth: 300,
    fontFamily: 'Source Sans 3',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: DARK_THEME.textSecondary,
    textAlign: 'center',
  },
  featuresCard: {
    backgroundColor: DARK_THEME.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_THEME.borderStrong,
    overflow: 'hidden',
  },
  bottomSection: {
    gap: 12,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: DARK_THEME.dangerBg,
    borderWidth: 1,
    borderColor: DARK_THEME.dangerBorder,
  },
  errorText: {
    flex: 1,
    fontFamily: 'Source Sans 3',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: DARK_THEME.dangerText,
  },
  errorCloseButton: {
    padding: 4,
  },
  googleButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: DARK_THEME.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleButtonText: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: DARK_THEME.textOnAccent,
  },
  disclaimer: {
    fontFamily: 'Source Sans 3',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: DARK_THEME.textMuted,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
