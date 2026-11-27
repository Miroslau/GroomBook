import { ComponentProps, FC } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/TabBar/TabBar';
import { DARK_THEME } from '../constants/theme';
import { MainTabParamList } from '../types/ParamList';
import HomeScreen from '../screens/home-screen/home-screen';
import CalendarScreen from '../screens/calendar-screen/calendar-screen';
import SettingsScreen from '../screens/settings-screen/settings-screen';
import ReminderScreen from '../screens/reminder-screen/reminder-screen';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const createTabIcon = (activeName: IoniconName, inactiveName: IoniconName) => {
  const TabIcon: FC<TabBarIconProps> = ({ focused, color, size }) => (
    <Ionicons name={focused ? activeName : inactiveName} size={size} color={color} />
  );
  TabIcon.displayName = `TabIcon(${activeName})`;
  return TabIcon;
};

const renderCustomTabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

const SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarActiveTintColor: DARK_THEME.accentPrimary,
  tabBarInactiveTintColor: DARK_THEME.textMuted,
};

const HOME_OPTIONS: BottomTabNavigationOptions = {
  tabBarLabel: 'День',
  tabBarIcon: createTabIcon('today', 'today-outline'),
  tabBarAccessibilityLabel: 'Экран дня',
};

const CALENDAR_OPTIONS: BottomTabNavigationOptions = {
  tabBarLabel: 'Календарь',
  tabBarIcon: createTabIcon('calendar', 'calendar-outline'),
  tabBarAccessibilityLabel: 'Месячный календарь',
};

const REMINDERS_OPTIONS: BottomTabNavigationOptions = {
  tabBarLabel: 'Напоминания',
  tabBarIcon: createTabIcon('notifications', 'notifications-outline'),
  tabBarAccessibilityLabel: 'Напоминания',
};

const SETTINGS_OPTIONS: BottomTabNavigationOptions = {
  tabBarLabel: 'Настройки',
  tabBarIcon: createTabIcon('settings', 'settings-outline'),
  tabBarAccessibilityLabel: 'Настройки',
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigation: FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={SCREEN_OPTIONS}
      tabBar={renderCustomTabBar}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={HOME_OPTIONS} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={CALENDAR_OPTIONS} />
      <Tab.Screen name="Reminders" component={ReminderScreen} options={REMINDERS_OPTIONS} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={SETTINGS_OPTIONS} />
    </Tab.Navigator>
  );
};

export default MainTabNavigation;
