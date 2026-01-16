import * as eva from '@eva-design/eva';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider } from '@ui-kitten/components';
import * as Notifications from 'expo-notifications';
import { StatusBar } from "expo-status-bar";
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { EventoAlteracoesProvider } from './src/context/EventoAlteracaoContext';
import { ItenValesProvider } from './src/context/ItensValeContext';
import { usePushNotifications } from './src/hooks/usePushNotifications';
import Routes from './src/routes';
import './src/services/pushNotification';
import { customMapping, customTheme } from "./src/theme/custom.theme";
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import { TotalDespesasProvider } from './src/context/TotalDespesasContext';
import { IncentiveProvider } from './src/context/InvenctiveContext';
import { FuncionariosIncentivoProvider } from './src/context/FuncionariosIncentivoContext';

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

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        // Verifica se há atualização disponível
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          // Se existir, pergunta ao usuário se quer atualizar
          Alert.alert(
            'Atualização disponível',
            'Uma nova versão do aplicativo está disponível. Deseja atualizar agora?',
            [
              { text: 'Depois', style: 'cancel' },
              {
                text: 'Atualizar',
                onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync(); // Reinicia o app com a nova versão
                },
              },
            ]
          );
        }
      } catch (error) {
        console.log('Erro ao verificar atualizações:', error);
      } finally {
        setChecking(false);
      }
    }

    checkForUpdates();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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