import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home-screen/home-screen';

export type AppStackParamList = {
  Home: undefined;
  Calendar: undefined;
  Reminders: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamList>();

const AppNavigation = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="Home" component={HomeScreen} />
    </AppStack.Navigator>
  );
};

export default AppNavigation;
