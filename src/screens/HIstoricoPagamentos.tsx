import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { mockEmployees } from '../mocks/mockData';
import { converterParaIsoDate, formatDateTime } from '../util/formatadores.util';
import { ItemVale } from '../components/ItemVale';
import { customTheme } from '../theme/custom.theme';
import { useHistoricoPagamentos } from '../hooks/usePagamentos';
import { Pagamento } from '../schema/pagamento.schema';
import { calcularTotalVales } from '../util/calculos.util';
import { FlatList } from 'react-native-gesture-handler';

export const HistoricoPagamentos = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { idFunc } = route.params as { idFunc: string };

  const employee = mockEmployees[0];

  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  if (!employee) {
    return (
      <Layout style={styles.center}>
        {/* <AlertCircle size={48} color="#ff3d71" /> */}
        <Text category="h6" style={styles.mt}>
          Funcionário não encontrado
        </Text>
        <Button
          appearance="outline"
          style={styles.mt}
          onPress={() => navigation.goBack()}
        >
          Voltar
        </Button>
      </Layout>
    );
  }

  const toggleExpand = (paymentId: string) => {
    setExpandedPayment((prev) =>
      prev === paymentId ? null : paymentId
    );
  };

  const ItemHistorico = ({ historicoPagamento }: { historicoPagamento: Pagamento }) => {
    const isExpanded = expandedPayment === historicoPagamento.id;

    return (
      <Card style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleExpand(historicoPagamento.id)}
          style={styles.cardHeader}
        >
          <View style={styles.headerLeft}>
            <Text appearance="hint" category="c1">
              {converterParaIsoDate(historicoPagamento.data_pagamento)}
            </Text>

            <View style={styles.amountRow}>
              <DinheiroDisplay
                value={historicoPagamento.valor_pago}
                size="md"
                variant="positive"
              />
              <Text appearance="hint" category="c1">
                pago
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.voucherInfo}>
              <Text appearance="hint" category="c1">
                Vale descontado
              </Text>
              <DinheiroDisplay
                value={-(calcularTotalVales(historicoPagamento.vales))}
                size="sm"
                variant="negative"
              />
            </View>

            {isExpanded ? (
              <MaterialIcons name="keyboard-arrow-up" size={24} color="#8f9bb3" />
            ) : (
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#8f9bb3" />
            )}
          </View>
        </TouchableOpacity>

        {/* Expanded content */}
        {isExpanded && (
          <View style={styles.expanded}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text appearance="hint" category="c1">
                  Salário Base
                </Text>
                <DinheiroDisplay
                  value={historicoPagamento.salario_atual}
                  size="sm"
                />
              </View>

              <View style={[styles.summaryCard, styles.dangerCard]}>
                <Text appearance="hint" category="c1">
                  Desconto Vale
                </Text>
                <DinheiroDisplay
                  value={-(calcularTotalVales(historicoPagamento.vales))}
                  size="sm"
                  variant="negative"
                />
              </View>
            </View>

            <View style={styles.voucherSection}>
              <View style={styles.voucherTitle}>
                <MaterialIcons name="receipt-long" size={15} color="#8f9bb3" />
                <Text category="s2">
                  Itens do Vale
                </Text>
              </View>

              <View>
                {historicoPagamento.vales.map((item) => (
                  <ItemVale
                    key={item.id}
                    item={item}
                    showControls={false}
                  // style={styles.voucherItem}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </Card>
    )
  }

  const { data: historico, isLoading } = useHistoricoPagamentos(idFunc)

  return (
    <Layout style={styles.container}>

      <View style={styles.content}>
        {
          (isLoading) ?
            <Spinner />
            :
            <FlatList
              data={historico}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.content}
              renderItem={({ item }) => (
                <ItemHistorico historicoPagamento={item} />
              )}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <MaterialIcons name="history" size={48} color="#8f9bb3" />
                  <Text appearance="hint" style={styles.mt}>
                    Nenhum pagamento registrado
                  </Text>
                  <Text appearance="hint" category="c1" style={{ textAlign: 'center' }}>
                    O histórico aparecerá após o primeiro pagamento
                  </Text>
                </View>
              }
              removeClippedSubviews
              windowSize={5}
              maxToRenderPerBatch={10}
              initialNumToRender={10}
            />
        }
      </View>
    </Layout>
  );
};


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },

  content: {
    padding: 16,
    gap: 12,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  mt: {
    marginTop: 16,
  },

  card: {
    padding: 0,
    overflow: 'hidden',
    backgroundColor: customTheme['background-basic-color-3']
  },

  cardHeader: {
    // padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    flex: 1,
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  voucherInfo: {
    alignItems: 'flex-end',
  },

  expanded: {
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 13,
    borderTopColor: 'rgba(143,155,179,0.2)',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  summaryCard: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(143,155,179,0.12)',
  },

  dangerCard: {
    backgroundColor: 'rgba(255, 61, 113, 0.09)',
  },

  voucherSection: {
    marginTop: 8,
  },

  voucherTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  voucherItem: {
    backgroundColor: 'rgba(143,155,179,0.15)',
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 4,
  },
});
