import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import StackRoutes from "./StackRoutes";

import { enableScreens } from 'react-native-screens';
enableScreens();

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.hideAsync()

export default function Routes() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}