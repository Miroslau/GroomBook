import RootNavigator from './src/navigation/root-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './src/store/store';
import * as WebBrowser from 'expo-web-browser';
import { useAuthInit } from './src/hooks/useAuthInit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const [fontsLoaded, fontsError] = useFonts({});

  const { isInitializing: isAuthInitializing } = useAuthInit();

  useEffect(() => {
    if ((fontsLoaded || fontsError) && !isAuthInitializing) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError, isAuthInitializing]);

  if ((!fontsLoaded && !fontsError) || isAuthInitializing) {
    return null;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <AppContent />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
