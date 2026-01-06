import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { Assinatura } from '../screens/Assinatura';
import { GerenciaVales } from '../screens/GerenciaVales';
import { ResumoPagamento } from '../screens/ResumoPagamento';
import { customTheme } from '../theme/custom.theme';
import { BottomTabsRoutes } from './BottomRoutes';

export type RootStackParamList = {
  Tabs: undefined;
  Vale: undefined;
  Funcionario: undefined;
  Cadastro: undefined;
  ResumoPagamento: undefined;
  Assinatura: undefined;
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
        name="Tabs"
        component={BottomTabsRoutes}
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
      
      <Stack.Screen
        name="Assinatura"
        component={Assinatura}
        options={{
          title: 'Assinatura do funcionário',
          headerStyle: {
            backgroundColor: customTheme['background-basic-color-1']
          },
          headerTintColor: customTheme['text-basic-color']
        }}
      />
    </Stack.Navigator>
  );
}