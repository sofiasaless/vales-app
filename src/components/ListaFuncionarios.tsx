import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect } from '@react-navigation/native';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFuncionariosRestaurante } from '../hooks/useFuncionarios';
import { useGerenteConectado } from '../hooks/useGerente';
import { useIncentivoAtivo } from '../hooks/useIncentivo';
import { useRestauranteId } from '../hooks/useRestaurante';
import { Gerente } from '../schema/gerente.schema';
import { customTheme } from '../theme/custom.theme';
import { calcularTotalVales } from '../util/calculos.util';
import { CardGradient } from './CardGradient';
import { DinheiroDisplay } from './DinheiroDisplay';
import { FuncionarioCard } from './FuncionarioCard';
import { IncentivoAtivoCard } from './IncentivoAtivoCard';

export const ListaFuncionarios = () => {
  const { data: gerente } = useGerenteConectado()
  const styles = style(gerente);

  const theme = useTheme();

  const EmptyState = () => (
    <View style={styles.empty}>
      <AntDesign name="usergroup-delete" size={46} color={theme['text-hint-color']} />
      <Text appearance="hint" style={styles.emptyText}>
        Nenhum funcionário cadastrado
      </Text>
      <Text category="c1" appearance="hint">
        Toque em "Cadastrar" para adicionar
      </Text>
    </View>
  );

  const { data: res, isLoading: carregandoRes } = useRestauranteId()

  const { data: funcionarios, isLoading, refetch } = useFuncionariosRestaurante(res?.uid || '')

  const { data: incentivo_ativo, isLoading: carregandoIncentivoAtivo, refetch: recarregarIncentivo } = useIncentivoAtivo(res?.uid || '');


  const valesAbertos = useMemo(() => {
    return funcionarios?.reduce((acc, func) => {
      return acc + calcularTotalVales(func.vales)
    }, 0)
  }, [funcionarios])

  const funcComVales = useMemo(() => {
    return funcionarios?.reduce((acc, func) => {
      if (func.vales.length > 0) {
        return acc + 1
      }
      return acc + 0
    }, 0)
  }, [funcionarios])

  useFocusEffect(
    useCallback(() => {
      if (carregandoRes) return;
      refetch()
      recarregarIncentivo()
    }, [carregandoRes])
  );

  return (
    <Layout level="1" style={styles.screen}>
      {incentivo_ativo &&
        <View style={[{ marginBottom: 10 }, styles.controleUsuario]}>
          <IncentivoAtivoCard incentivo={incentivo_ativo} />
        </View>
      }

      <View style={[styles.summaryGrid, styles.controleUsuario]}>
        {/* Total Employees */}
        <CardGradient styles={styles.summaryCard}>
          <View style={styles.row}>
            <Feather name="users" size={16} color={theme['text-hint-color']} />
            <Text category="c1" appearance="hint">
              Total
            </Text>
          </View>

          <Text category="h5" style={styles.value}>
            {funcionarios?.length || 0}
          </Text>

          <Text category="c1" appearance="hint">
            funcionários
          </Text>
        </CardGradient>

        {/* Open Vouchers */}
        <CardGradient styles={styles.summaryCard}>
          <View style={styles.row}>
            <FontAwesome6 name="arrow-trend-up" size={16} color={customTheme['color-primary-600']} />
            <Text category="c1" status="primary">
              Vales Abertos
            </Text>
          </View>

          <DinheiroDisplay value={valesAbertos || 0} variant='positive' size='md' />

          <Text category="c1" appearance="hint" style={styles.mt4}>
            {funcComVales} funcionário(s) com vales
          </Text>
        </CardGradient>
      </View>

      {
        (isLoading) ?
          <Text>Carregando funcionários...</Text>
          :
          <FlatList
            showsVerticalScrollIndicator={false}
            data={funcionarios}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.employeeItem}>
                <FuncionarioCard employee={item} />
              </View>
            )}
            ListEmptyComponent={<EmptyState />}
          />
      }
    </Layout>
  );
};

const style = (gerente: Gerente | null | undefined) => {
  return StyleSheet.create({
    controleUsuario: {
      display: (gerente) ? ((gerente.tipo === 'AUXILIAR') ? 'none' : 'flex') : 'flex'
    },
    screen: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },

    /* Summary cards */
    summaryGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },

    summaryCard: {
      flex: 1,
      borderRadius: 14,
      padding: 16,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },

    value: {
      marginVertical: 4,
    },

    mt4: {
      marginTop: 4,
    },

    /* Employee grid */
    list: {
      paddingBottom: 24,
    },

    column: {
      gap: 12,
    },

    employeeItem: {
      flex: 1,
      marginBottom: 12,
    },

    empty: {
      alignItems: 'center',
      marginTop: 48,
    },
    emptyText: {
      marginTop: 12,
      marginBottom: 4,
    },
  });

}

