import { BottomTabNavigationEventMap, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native';
import { Cadastro } from '../screens/Cadastro';
import { Funcionarios } from '../screens/Funcionarios';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { BottomTab } from '../components/BottomTab';
import { Perfil } from '../screens/Perfil';

export type BottomTabParamList = {
  Funcionarios: undefined;
  Cadastro: undefined;
  Perfil: undefined;
};

const TabStack = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabsRoutes = () => {
  
  return (
    <TabStack.Navigator
      screenOptions={{ 
        headerShown: false
      }}
      tabBar={(props) => <BottomTab {...props}/>}
    >
      <TabStack.Screen 
        name="Funcionarios" 
        component={Funcionarios}
        options={{ title: 'Funcionários' }}
      />
      <TabStack.Screen 
        name="Cadastro" 
        component={Cadastro}
        options={{ title: 'Cadastrar' }}
      />
      <TabStack.Screen 
        name="Perfil" 
        component={Perfil}
        options={{ title: 'Meu Perfil' }}
      />
    </TabStack.Navigator>
  );
};