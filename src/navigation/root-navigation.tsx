import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import AuthNavigation from './auth-navigation';
import AppNavigation from './app-navigation';
import { useSelector } from 'react-redux';
import { RootState, useAppSelector } from '../store/store';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { DARK_THEME } from '../constants/theme';

export type RootStackParamList = {
  App: undefined;
  Auth: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const NAVIGATION_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: DARK_THEME.bgBase,
    card: DARK_THEME.bgSurface,
    text: DARK_THEME.textPrimary,
    border: DARK_THEME.borderStrong,
    primary: DARK_THEME.accentPrimary,
  },
};

const ROOT_STACK_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
};

const AUTH_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  animationTypeForReplace: 'pop',
};

export default function RootNavigator() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitializing = useAppSelector((state) => state.auth.isInitializing);

  if (isInitializing) {
    return null;
  }

  return (
    <NavigationContainer theme={NAVIGATION_THEME}>
      <RootStack.Navigator screenOptions={ROOT_STACK_OPTIONS}>
        {isAuthenticated ? (
          <RootStack.Screen name="App" component={AppNavigation} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigation} options={AUTH_SCREEN_OPTIONS} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
