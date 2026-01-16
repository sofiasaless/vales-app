import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from 'react-native-screens';
import { AuthGuard } from "../guards/AuthGuard";
import LoginStack from "./LoginStack";
import StackRoutes from "./StackRoutes";

enableScreens();
SplashScreen.hideAsync()

export default function Routes() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthGuard fallback={<LoginStack />}>
          <StackRoutes />
        </AuthGuard>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}