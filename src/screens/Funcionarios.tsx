import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StyleSheet } from "react-native";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { ListaFuncionarios } from "../components/ListaFuncionarios";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

SplashScreen.preventAutoHideAsync();

export const Funcionarios = () => {

  const [loaded, error] = useFonts({
    'JetBrains-Regular': require('../../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrains-Bold': require('../../assets/fonts/JetBrainsMono-Bold.ttf'),
    'JetBrains-Medium': require('../../assets/fonts/JetBrainsMono-Medium.ttf'),
    'JetBrains-SemiBold': require('../../assets/fonts/JetBrainsMono-SemiBold.ttf'),
  });

  useFocusEffect(
    useCallback(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error])
  );

  if (!loaded && !error) {
    return null;
  }

  return (
    <Container>
      <Header title="Funcionários" subtitle="3 cadastrados" />
      <ListaFuncionarios />
    </Container>
  )
}

const styles = StyleSheet.create({

});