import React from "react";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { customTheme } from "./src/theme/custom.theme";
import { Funcionarios } from "./src/screens/Funcionarios";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...customTheme }}>
      <Funcionarios />
      <StatusBar style="light" />
    </ApplicationProvider>
  )
}