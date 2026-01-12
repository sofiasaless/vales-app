import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import StackRoutes from "./StackRoutes";
import { enableScreens } from 'react-native-screens';
import * as SplashScreen from 'expo-splash-screen';
import { View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useGerenteConectado } from "../hooks/useGerente";
import { Spinner } from "@ui-kitten/components";

enableScreens();
SplashScreen.hideAsync()

export default function Routes() {
  const { user, loading } = useAuth();
  const { data: gerente, isLoading: loadingGerente } = useGerenteConectado();

  if (loading || loadingGerente) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackRoutes
          isAuthenticated={!!user}
          hasGerente={!!gerente}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}