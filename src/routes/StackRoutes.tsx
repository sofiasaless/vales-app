import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { Assinatura } from '../screens/Assinatura';
import { GerenciaVales } from '../screens/GerenciaVales';
import { ResumoPagamento } from '../screens/ResumoPagamento';
import { customTheme } from '../theme/custom.theme';
import { BottomTabsRoutes } from './BottomRoutes';
import { DetalhesFuncionario } from '../screens/DetalhesFuncionario';
import { HIstoricoPagamentos } from '../screens/HIstoricoPagamentos';

export type RootStackParamList = {
  Tabs: undefined;
  Vale: undefined;
  Funcionario: undefined;
  Cadastro: undefined;
  ResumoPagamento: undefined;
  Assinatura: undefined;
  Detalhes: undefined;
  Historico: undefined;
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
        options={optionsHeader('Gerênciar vales')}
      />

      <Stack.Screen
        name="ResumoPagamento"
        component={ResumoPagamento}
        options={optionsHeader('Resumo pagamento')}
      />

      <Stack.Screen
        name="Assinatura"
        component={Assinatura}
        options={optionsHeader('Assinatura do funcionário')}
      />

      <Stack.Screen
        name="Detalhes"
        component={DetalhesFuncionario}
        options={optionsHeader('Detalhes')}
      />

      <Stack.Screen
        name="Historico"
        component={HIstoricoPagamentos}
        options={optionsHeader('Histórico de pagamentos')}
      />
    </Stack.Navigator>
  );
}

const optionsHeader = (title: string): StackNavigationOptions => {
  return {
    title: title,
    headerStyle: {
      backgroundColor: customTheme['background-basic-color-1']
    },
    headerTintColor: customTheme['text-basic-color']
  }
}