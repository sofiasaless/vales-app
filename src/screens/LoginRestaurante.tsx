import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Input, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CardGradient } from '../components/CardGradient';
import { useLoginRestaurante } from '../hooks/useLoginRestaurante';
import { RootStackParamList } from '../routes/StackRoutes';

import * as SplashScreen from 'expo-splash-screen';
import { useGerenteConectado } from '../hooks/useGerente';
import { customTheme } from '../theme/custom.theme';

SplashScreen.hideAsync()

export const LoginRestaurante: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const navigator = useNavigation<NavigationProp<RootStackParamList>>()

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 4) {
      newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { entrarComRestaurante, isLoading: carregandoLogin } = useLoginRestaurante()

  const { refetch } = useGerenteConectado()

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if ((await entrarComRestaurante(email, password)).ok) {
      refetch()
    }

  };

  return (
    <CardGradient colors_one='4' colors_two='1' styles={styles.container}>
      <View style={styles.header}>
        <View style={{backgroundColor: customTheme['background-transparent-primary'], padding: 20, borderRadius: 50, marginBottom: 20}}>
          <AntDesign name="shop" size={40} color={customTheme['color-primary-500']} />
        </View>
        <Text category="h3" style={styles.title}>
          Bem-vindo ao Vale App!
        </Text>
        <Text appearance="hint" style={styles.subtitle}>
          Entre com as credenciais do seu restaurante
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Input
          label="E-mail do Restaurante"
          placeholder="email@restaurante.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          status={errors.email ? 'danger' : 'primary'}
          caption={errors.email}
          style={styles.input}
        />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          status={errors.password ? 'danger' : 'primary'}
          caption={errors.password}
          style={styles.input}
        />

        <Button
          size="large"
          onPress={handleSubmit}
          disabled={carregandoLogin}
          style={styles.button}
        >
          {carregandoLogin ? 'Entrando...' : 'Entrar'}
        </Button>
      </View>
    </CardGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  icon: {
    fontSize: 44,
    marginBottom: 12,
  },

  title: {
    fontWeight: '700',
    textAlign: 'center',
    color: customTheme['color-primary-400']
  },

  subtitle: {
    marginTop: 6,
    textAlign: 'center',
  },

  form: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 16,
  },

  input: {
    marginBottom: 8,
  },

  button: {
    marginTop: 16,
  },

  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },

  hint: {
    fontSize: 12,
  },
});
