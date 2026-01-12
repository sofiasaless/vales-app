import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { Funcionario } from '../schema/funcionario.schema';
import { Assinatura } from '../screens/Assinatura';
import Cardapio from '../screens/Cardapio';
import { DetalhesFuncionario } from '../screens/DetalhesFuncionario';
import { EditarFuncionario } from '../screens/EditarFuncionario';
import { GerenciaCardapio } from '../screens/GerenciaCardapio';
import { GerenciaVales } from '../screens/GerenciaVales';
import { HistoricoPagamentos } from '../screens/HIstoricoPagamentos';
import { LoginGerente } from '../screens/LoginGerente';
import { LoginRestaurante } from '../screens/LoginRestaurante';
import Mensalidades from '../screens/Mensalidades';
import { ResumoPagamento } from '../screens/ResumoPagamento';
import { customTheme } from '../theme/custom.theme';
import { BottomTabsRoutes } from './BottomRoutes';
import Financas from '../screens/Financas';
import FinancasDetalhe from '../screens/FinancasDetalhe';
import { CategoriaFinancas } from '../schema/financa.schema';

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
  Financas: { idRest: string };
  FinancasDetalhes: { categoriaObj: CategoriaFinancas };
};

const Stack = createStackNavigator<RootStackParamList>();

enableScreens();

type Props = {
  isAuthenticated: boolean;
  hasGerente: boolean;
};

export default function StackRoutes({isAuthenticated, hasGerente}: Props) {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Config"
        component={Config}
        options={{ headerShown: false }}
      /> */}

      {/* <Stack.Screen
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
      /> */}

      {!isAuthenticated ? (
        <Stack.Screen name="LoginRestaurante" component={LoginRestaurante} options={{ headerShown: false }} />
      ) : !hasGerente ? (
        <Stack.Screen name="LoginGerente" component={LoginGerente} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Tabs" component={BottomTabsRoutes} options={{ headerShown: false }} />
      )}

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

      <Stack.Screen
        name="Financas"
        component={Financas}
        options={optionsHeader('Gerenciar finanças do restaurante')}
      />

      <Stack.Screen
        name="FinancasDetalhes"
        component={FinancasDetalhe}
        options={optionsHeader('Despesas por categoria')}
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