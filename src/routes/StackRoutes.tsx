import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { GerenciaVales } from '../screens/GerenciaVales';
import { customTheme } from '../theme/custom.theme';
import { Funcionarios } from '../screens/Funcionarios';
import { ResumoPagamento } from '../screens/ResumoPagamento';

export type RootStackParamList = {
  Vale: undefined;
  Funcionario: undefined;
  ResumoPagamento: undefined;
  // Comanda: { idMesa: string | undefined };
  // Cardapio: { idMesa: string | undefined };
  // Transferir: { idMesa: string | undefined, disponibilizarMesa: boolean | undefined };
  // Configuracoes: undefined;
  // HistoricoConta: { idHistorico: string | undefined };
};

const Stack = createStackNavigator<RootStackParamList>();

enableScreens();

export default function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Funcionario"
        component={Funcionarios}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Vale"
        component={GerenciaVales}
        options={{
          title: 'Gerênciar vales',
          headerStyle: {
            backgroundColor: customTheme['background-basic-color-1']
          },
          headerTintColor: customTheme['text-basic-color']
        }}
      />

      <Stack.Screen
        name="ResumoPagamento"
        component={ResumoPagamento}
        options={{
          title: 'Resumo pagamento',
          headerStyle: {
            backgroundColor: customTheme['background-basic-color-1']
          },
          headerTintColor: customTheme['text-basic-color']
        }}
      />
    </Stack.Navigator>
  );
}