import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { StatusBar } from "expo-status-bar";
import React from "react";
import Routes from './src/routes';
import { customMapping, customTheme } from "./src/theme/custom.theme";
import { EvaIconsPack } from '@ui-kitten/eva-icons';

export default function App() {

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