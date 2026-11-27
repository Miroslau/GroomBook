import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, Alert } from 'react-native';
import { DARK_THEME } from '../../constants/theme';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../store/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { PressableButton } from '../../components/Button/Button';

const DANGER_COLOR = '#F87171';
const DANGER_BG = 'rgba(248, 113, 113, 0.12)';
const DANGER_BORDER = 'rgba(248, 113, 113, 0.35)';

const SettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.auth.user);
  const [isSigningOut, setIsSignOut] = useState<boolean>(false);

  const displayName = user?.displayName?.trim() || 'Пользователь';
  const email = user?.email?.trim() || 'Почта не указана';

  const executeSignOut = useCallback(async () => {
    setIsSignOut(true);
    try {
      await perfor;
    } catch (error: unknown) {
    } finally {
      setIsSignOut(false);
    }
  }, [dispatch]);

  const handleSignOutPress = useCallback(() => {
    if (isSigningOut) {
      return;
    }

    Alert.alert(
      'Выйти из аккаунта?',
      'Все данные сохранены в облаке. Для повторного входа потребуется интернет.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: () => {
            void executeSignOut();
          },
        },
      ]
    );
  }, [executeSignOut, isSigningOut]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Настройки</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionLabel}>АККАУНТ</Text>

        <View style={styles.card}>
          <View style={styles.accountRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color={DARK_THEME.accentPrimary} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {email}
              </Text>
            </View>
          </View>
        </View>

        <PressableButton
          onPress={handleSignOutPress}
          disabled={isSigningOut}
          accessibilityLabel="Выйти из аккаунта"
          style={styles.logoutButton}
          activeScale={0.98}
        >
          <View style={styles.logoutContent}>
            <Ionicons name="log-out-outline" size={20} color={DANGER_COLOR} />
            <Text style={styles.logoutText}>{isSigningOut ? 'Выход...' : 'Выйти из аккаунта'}</Text>
          </View>
        </PressableButton>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_THEME.bgBase,
  },
  header: {
    backgroundColor: DARK_THEME.bgSurface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: DARK_THEME.borderStrong,
  },
  screenTitle: {
    fontFamily: 'Roboto Slab',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    color: DARK_THEME.textPrimary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionLabel: {
    fontFamily: 'Source Sans 3',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: DARK_THEME.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: DARK_THEME.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DARK_THEME.borderStrong,
    padding: 14,
    marginBottom: 20,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DARK_THEME.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: '700',
    color: DARK_THEME.textPrimary,
  },
  userEmail: {
    fontFamily: 'Source Sans 3',
    fontSize: 13,
    fontWeight: '400',
    color: DARK_THEME.textSecondary,
  },
  logoutButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: DANGER_BG,
    borderWidth: 1,
    borderColor: DANGER_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontFamily: 'Source Sans 3',
    fontSize: 15,
    fontWeight: '700',
    color: DANGER_COLOR,
  },
});
