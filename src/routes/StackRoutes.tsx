import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { Assinatura } from '../screens/Assinatura';
import { GerenciaVales } from '../screens/GerenciaVales';
import { ResumoPagamento } from '../screens/ResumoPagamento';
import { customTheme } from '../theme/custom.theme';
import { BottomTabsRoutes } from './BottomRoutes';
import { DetalhesFuncionario } from '../screens/DetalhesFuncionario';
import Mensalidades from '../screens/Mensalidades';
import Cardapio from '../screens/Cardapio';
import { GerenciaCardapio } from '../screens/GerenciaCardapio';
import { Funcionario } from '../schema/funcionario.schema';
import { EditarFuncionario } from '../screens/EditarFuncionario';
import { Config } from '../screens/Config';
import { LoginRestaurante } from '../screens/LoginRestaurante';
import { LoginGerente } from '../screens/LoginGerente';
import { HistoricoPagamentos } from '../screens/HIstoricoPagamentos';

export type RootStackParamList = {
  Tabs: undefined;
  Vale: { idFunc: string };
  Funcionario: undefined;
  Cadastro: undefined;
  ResumoPagamento: { funcObj: Funcionario };
  Assinatura: undefined;
  GerenciaCardapio: undefined;
  Detalhes: { idFunc: string };
  Historico: { idFunc: string };
  Mensalidades: undefined;
  Cardapio: { idFunc: string };
  EditarFuncionario: { funcObj: Funcionario };
  LoginRestaurante: undefined;
  LoginGerente: undefined;
  Config: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

enableScreens();

export default function StackRoutes() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Config"
        component={Config}
        options={{ headerShown: false }}
      /> */}

      <Stack.Screen
        name="LoginRestaurante"
        component={LoginRestaurante}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LoginGerente"
        component={LoginGerente}
        options={{ headerShown: false }}
      />
      
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
        name="EditarFuncionario"
        component={EditarFuncionario}
        options={optionsHeader('Editar funcionário')}
      />

      <Stack.Screen
        name="Historico"
        component={HistoricoPagamentos}
        options={optionsHeader('Histórico de pagamentos')}
      />

      <Stack.Screen
        name="Mensalidades"
        component={Mensalidades}
        options={optionsHeader('Mensalidades')}
      />

      <Stack.Screen
        name="Cardapio"
        component={Cardapio}
        options={optionsHeader('Cardápio')}
      />

      <Stack.Screen
        name="GerenciaCardapio"
        component={GerenciaCardapio}
        options={optionsHeader('Gerenciar itens do cardápio')}
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