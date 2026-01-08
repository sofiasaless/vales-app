import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import Routes from './src/routes';
import './src/services/pushNotification';
import { customMapping, customTheme } from "./src/theme/custom.theme";
import { usePushNotifications } from './src/hooks/usePushNotifications'
import { ENV } from './src/config/env';
import * as Updates from 'expo-updates';

export default function App() {
  console.info('env ', ENV)

  usePushNotifications()

  const handleUpdates = async () => {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  }

  useEffect(() => {
    handleUpdates()
  }, [])

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...customTheme }} customMapping={customMapping}>
        <Routes />
        <StatusBar style="light" />
      </ApplicationProvider>
    </>
  )
}