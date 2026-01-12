import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Text
} from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CardGradient } from '../components/CardGradient';
import { useLoginGerente } from '../hooks/useLoginGerente';
import { useRestauranteConectado } from '../hooks/useRestaurante';
import { RootStackParamList } from '../routes/StackRoutes';
import { useGerenteConectado } from '../hooks/useGerente';

export const LoginGerente: React.FC = () => {

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ manager?: string; password?: string }>({});

  const navigator = useNavigation<NavigationProp<RootStackParamList>>()

  const { entrarComGerente, gerentes, isLoading, isLoadingGerentes, listarGerentes } = useLoginGerente()

  const {
    data: restaurante_conectado,
    isLoading: loadingRes
  } = useRestauranteConectado()

  const validateForm = (): boolean => {
    const newErrors: { manager?: string; password?: string } = {};

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { refetch } = useGerenteConectado()

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const restauranteId = await AsyncStorage.getItem('uid')
    if (restauranteId && gerentes) {
      const res = await entrarComGerente(restauranteId, gerentes.at(selectedIndex)?.id || '', password)
      if (!res.ok) {
        const newErrors: { manager?: string; password?: string } = {};
        newErrors.password = res.message
        setErrors(newErrors);
      } else {
        refetch()
      }
    }

  };

  const handleBack = () => {
    navigator.navigate('LoginRestaurante')
  };

  const carregarInformacoes = async () => {
    await listarGerentes(restaurante_conectado?.id || '')
  }

  useFocusEffect(
    useCallback(() => {
      carregarInformacoes()
    }, [loadingRes])
  )

  return (
    <CardGradient colors_one='4' colors_two='1' styles={styles.container}>
      <View style={styles.header}>
        <View style={styles.restaurantBadge}>
          <Text category="s1" style={styles.restaurantName}>
            {restaurante_conectado?.nome_fantasia}
          </Text>
        </View>

        <Text category="h3" style={styles.title}>
          Olá, Gerente!
        </Text>
        <Text appearance="hint" style={styles.subtitle}>
          Selecione seu perfil para continuar
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={{ marginBottom: 12 }}>
          <Text category="label" appearance='hint' style={{ marginBottom: 8 }}>
            Selecione o gerente
          </Text>

          {isLoadingGerentes ?
            <Spinner size='small' />
            :
            <RadioGroup
              selectedIndex={selectedIndex}
              onChange={(index) =>
                setSelectedIndex(index)
              }
            >
              {gerentes?.map((g) => (
                <Radio key={g.id}>{g.nome}</Radio>
              ))}
            </RadioGroup>
          }
        </View>


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

        <View style={styles.actions}>
          <Button
            size="large"
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.primaryButton}
          >
            {isLoading ? 'Entrando...' : 'Acessar Sistema'}
          </Button>

          <Button
            appearance="ghost"
            status="basic"
            onPress={handleBack}
            style={styles.backButton}
          >
            ← Voltar para login do restaurante
          </Button>
        </View>
      </View>
    </CardGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    justifyContent: 'flex-start',
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  restaurantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  restaurantIcon: {
    fontSize: 24,
  },

  restaurantName: {
    fontWeight: '600',
  },

  title: {
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 6,
    textAlign: 'center',
  },

  form: {
    flex: 1,
  },

  input: {
    marginBottom: 16,
  },

  actions: {
    marginTop: 8,
    gap: 12,
  },

  primaryButton: {
    marginTop: 8,
  },

  backButton: {
    alignSelf: 'center',
  },

  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },

  hint: {
    fontSize: 12,
  },
});
