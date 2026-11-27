import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './auth-navigation';
import AppNavigation from './app-navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function RootNavigator() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
}
