import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { StatusBar } from "expo-status-bar";
import React from "react";
import Routes from './src/routes';
import { customMapping, customTheme } from "./src/theme/custom.theme";

export default function App() {

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...customTheme }} customMapping={customMapping}>
      <Routes />
      <StatusBar style="light" />
    </ApplicationProvider>
  )
}