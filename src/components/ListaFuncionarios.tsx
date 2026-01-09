import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect } from '@react-navigation/native';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFuncionarios } from '../hooks/useFuncionarios';
import { CardGradient } from './CardGradient';
import { FuncionarioCard } from './FuncionarioCard';

export const ListaFuncionarios = () => {
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

  const { listarFuncionarios, listaFuncionarios, isLoading } = useFuncionarios()

  useFocusEffect(
    useCallback(() => {
      listarFuncionarios()
    }, [])
  );

  return (
    <Layout level="1" style={styles.screen}>
      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        {/* Total Employees */}
        <CardGradient styles={styles.summaryCard}>
          <View style={styles.row}>
            <Feather name="users" size={16} color={theme['text-hint-color']} />
            <Text category="c1" appearance="hint">
              Total
            </Text>
          </View>

          <Text category="h5" style={styles.value}>
            {listaFuncionarios?.length || 0}
          </Text>

          <Text category="c1" appearance="hint">
            funcionários
          </Text>
        </CardGradient>

        {/* Open Vouchers */}
        <CardGradient styles={styles.summaryCard}>
          <View style={styles.row}>
            <FontAwesome6 name="arrow-trend-down" size={16} color={theme['color-danger-500']} />
            <Text category="c1" status="danger">
              Vales Abertos
            </Text>
          </View>

          <Text category="h5" status="danger" style={styles.value}>
            R$ {(31972).toFixed(2)}
          </Text>

          <Text category="c1" appearance="hint" style={styles.mt4}>
            32 funcionário(s)
          </Text>
        </CardGradient>
      </View>

      {
        (isLoading) ?
          <Text>Carregando funcionários...</Text>
          :
          <FlatList
            showsVerticalScrollIndicator={false}
            data={listaFuncionarios}
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

const styles = StyleSheet.create({
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
