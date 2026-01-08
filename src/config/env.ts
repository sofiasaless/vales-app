import Constants from 'expo-constants';

type ExpoExtra = {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
};

export const ENV = Constants.expoConfig?.extra as ExpoExtra;
