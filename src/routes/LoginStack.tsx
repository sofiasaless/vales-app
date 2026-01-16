import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { LoginRestaurante } from '../screens/LoginRestaurante';

export type RootStackParamList = {
  LoginRestaurante: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

enableScreens();

export default function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginRestaurante" component={LoginRestaurante} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
