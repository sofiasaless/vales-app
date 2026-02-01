import * as eva from '@eva-design/eva';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider } from '@ui-kitten/components';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import React from "react";
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './src/context/AuthContext';
import { EventoAlteracoesProvider } from './src/context/EventoAlteracaoContext';
import { FuncionariosIncentivoProvider } from './src/context/FuncionariosIncentivoContext';
import { IncentiveProvider } from './src/context/InvenctiveContext';
import { ItenValesProvider } from './src/context/ItensValeContext';
import { TotalDespesasProvider } from './src/context/TotalDespesasContext';
import Routes from './src/routes';
import './src/services/pushNotification';
import { customMapping, customTheme } from "./src/theme/custom.theme";

SplashScreen.hideAsync()
enableScreens();

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ItenValesProvider>
        <EventoAlteracoesProvider>
          <TotalDespesasProvider>
            <IncentiveProvider>
              <FuncionariosIncentivoProvider>
                <ApplicationProvider {...eva} theme={{ ...eva.dark, ...customTheme }} customMapping={customMapping}>
                  <AuthProvider>
                    <Routes />
                  </AuthProvider>
                  <StatusBar style="light" />
                </ApplicationProvider>
              </FuncionariosIncentivoProvider>
            </IncentiveProvider>
          </TotalDespesasProvider>
        </EventoAlteracoesProvider>
      </ItenValesProvider>
    </QueryClientProvider>
  )
}