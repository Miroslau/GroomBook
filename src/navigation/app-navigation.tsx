import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/ParamList';
import MainTabNavigation from './main-tab-navigation';

const AppStack = createNativeStackNavigator<AppStackParamList>();

const STACK_SCREEN_OPTIONS = {
  headerShown: false,
} as const;

const AppNavigation = () => {
  return (
    <AppStack.Navigator screenOptions={STACK_SCREEN_OPTIONS}>
      <AppStack.Screen name="MainTabs" component={MainTabNavigation} />
    </AppStack.Navigator>
  );
};

export default AppNavigation;
