import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBS_yyVhAnliMHqKX_VHezpW1enj9pHSeY',
  authDomain: 'grooming-app-89a51.firebaseapp.com',
  projectId: 'grooming-app-89a51',
  storageBucket: 'grooming-app-89a51.firebasestorage.app',
  messagingSenderId: '907187837254',
  appId: '1:907187837254:web:11cc82dbb7da14bd77ed47',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    return getAuth(app);
  }
})();

export { app, auth, db };

// Android: 916896678029-5g41tkbhlgk3s16mcmrc0uu1q8dn5l1m.apps.googleusercontent.com
// IOS: 916896678029-64qodebarcdso9aq1qjlsh35ddiel7r6.apps.googleusercontent.com
