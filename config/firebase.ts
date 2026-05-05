import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ausente: ${name}.`,
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: requiredEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requiredEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: requiredEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

function createAuth() {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();

export const db = getFirestore(app);
export const storage = getStorage(app);
