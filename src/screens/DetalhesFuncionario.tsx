import Entypo from '@expo/vector-icons/Entypo';
import {
  Button,
  Card,
  Divider,
  Layout,
  Text
} from '@ui-kitten/components';
import React, { ReactNode, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { NavigationProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AvatarIniciais } from '../components/AvatarIniciais';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { useFuncionarios } from '../hooks/useFuncionarios';
import { customTheme } from '../theme/custom.theme';
import { converterParaIsoDate, formatCPF } from '../util/formatadores.util';
import { RootStackParamList } from '../routes/StackRoutes';
import { FuncionarioFirestore } from '../firestore/funcionario.firestore';

interface RouteParams {
  idFunc: string
}

export const DetalhesFuncionario = () => {
  const route = useRoute();
  const { idFunc } = route.params as RouteParams;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: ReactNode;
    label: string;
    value: string | React.ReactNode;
  }) => {
    return (
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          {icon}
        </View>

        <View style={{ flex: 1 }}>
          <Text appearance="hint" category="c1">
            {label}
          </Text>
          {typeof value === 'string' ? (
            <Text category="s1">{value}</Text>
          ) : (
            value
          )}
        </View>
      </View>
    );
  }

  const { encontrarPorId, isLoadingF, funcionarioFoco } = useFuncionarios()

  const handleExcluir = async () => {
    try {
      const funcFir = new FuncionarioFirestore()
      await funcFir.excluir(idFunc)
      navigation.navigate('Funcionario')
    } catch (error) {
      console.error('erro ao excluir funcionário ', error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      encontrarPorId(idFunc);
    }, [idFunc])
  )

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {(isLoadingF) ?
          <Text>Carregando...</Text>
          :
          <>
            <Card style={styles.cardCenter}>
              <AvatarIniciais name={funcionarioFoco?.nome || ''} size='md' />
              <Text category="h5" style={styles.name}>
                {funcionarioFoco?.nome}
              </Text>
              <Text appearance="hint">{funcionarioFoco?.cargo}</Text>

              <View style={styles.typeBadge}>
                <Text category="c1" style={{ color: customTheme['color-primary-600'] }}>
                  {funcionarioFoco?.tipo === 'DIARISTA'
                    ? 'Diarista'
                    : 'Fixo (Quinzenas)'}
                </Text>
              </View>
            </Card>

            {/* Personal Info */}
            <Card style={styles.card}>
              <Text category="s1" style={styles.cardTitle}>
                Informações Pessoais
              </Text>
              <Divider />

              {funcionarioFoco?.cpf && (
                <InfoRow
                  icon={<Entypo name="text-document-inverted" size={22} color={customTheme['text-hint-color']} />}
                  label="CPF"
                  value={formatCPF(funcionarioFoco?.cpf)}
                />
              )}

              {funcionarioFoco?.data_nascimento && (
                <InfoRow
                  icon={<Entypo name="cake" size={22} color={customTheme['text-hint-color']} />}
                  label="Data de Nascimento"
                  value={converterParaIsoDate(funcionarioFoco?.data_nascimento)}
                />
              )}
            </Card>

            {/* Employment Info */}
            <Card style={styles.card}>
              <Text category="s1" style={styles.cardTitle}>
                Dados Funcionais
              </Text>
              <Divider />

              <InfoRow
                icon={<Entypo name="briefcase" size={22} color={customTheme['text-hint-color']} />}
                label="Cargo"
                value={funcionarioFoco?.cargo}
              />

              <InfoRow
                icon={<Entypo name="wallet" size={22} color={customTheme['text-hint-color']} />}
                label={
                  funcionarioFoco?.tipo === 'DIARISTA'
                    ? 'Valor Diária'
                    : 'Salário Base'
                }
                value={<DinheiroDisplay value={funcionarioFoco?.salario || 0} />}
              />

              <InfoRow
                icon={<Entypo name="calendar" size={22} color={customTheme['text-hint-color']} />}
                label="Data de Admissão"
                value={converterParaIsoDate(funcionarioFoco?.data_admissao)}
              />

              <InfoRow
                icon={<Entypo name="clock" size={22} color={customTheme['text-hint-color']} />}
                label="Primeiro Dia de Pagamento"
                value={funcionarioFoco?.primeiro_dia_pagamento.toString()}
              />

              <InfoRow
                icon={<Entypo name="clock" size={22} color={customTheme['text-hint-color']} />}
                label="Segundo Dia de Pagamento"
                value={funcionarioFoco?.segundo_dia_pagamento.toString()}
              />
            </Card>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                appearance="outline"
                style={styles.actionButton}
                onPress={() => navigation.navigate('EditarFuncionario', { funcObj: funcionarioFoco! })}
              >
                Editar
              </Button>

              <Button
                status="danger"
                style={styles.actionButton}
                onPress={handleExcluir}
              >
                Demitir
              </Button>
            </View>
          </>
        }
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  iconLarge: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },

  mt: {
    marginTop: 16,
  },

  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: customTheme['text-disabled-color'],
    borderRadius: 10,
    backgroundColor: customTheme['background-basic-color-3']
  },

  cardCenter: {
    margin: 16,
    padding: 12,
    borderWidth: 0.5,
    borderColor: customTheme['text-disabled-color'],
    borderRadius: 10,
    backgroundColor: customTheme['background-basic-color-3']
  },

  name: {
    marginTop: 12,
  },

  typeBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },

  cardTitle: {
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoIconInner: {
    width: 18,
    height: 18,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
  },

  actionButton: {
    flex: 1,
  },
});
