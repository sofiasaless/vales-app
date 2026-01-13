import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import { Button, Card, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import { DatePicker } from '../components/DatePicker';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { ItemVale } from '../components/ItemVale';
import { useHistoricoPagamentos } from '../hooks/usePagamentos';
import { Pagamento } from '../schema/pagamento.schema';
import { customTheme } from '../theme/custom.theme';
import { calcularTotalVales } from '../util/calculos.util';
import { converterParaDate } from '../util/datas.util';
import { converterParaIsoDate, converterTimestamp } from '../util/formatadores.util';
import { gerarRelatorioVales } from '../util/relatorios.util';
import { Funcionario } from '../schema/funcionario.schema';

export const HistoricoPagamentos = () => {
  const route = useRoute<any>();
  const { funcObj } = route.params as { funcObj: Funcionario };

  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  const toggleExpand = (paymentId: string) => {
    setExpandedPayment((prev) =>
      prev === paymentId ? null : paymentId
    );
  };

  const [dataInicio, setDataInicio] = useState(new Date(new Date().setDate(1)))
  const settingInicio = (tipo: 'DATA' | 'HORA', dado?: string) => {
    if (tipo === 'DATA' && dado != undefined) {
      setDataInicio(converterParaDate(dado))
    }
  }
  const [dataFim, setDataFim] = useState(new Date())
  const settingFim = (tipo: 'DATA' | 'HORA', dado?: string) => {
    if (tipo === 'DATA' && dado != undefined) {
      setDataFim(converterParaDate(dado))
    }
  }

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

            <View style={{gap: 8}}>
              <Button style={{ display: (historicoPagamento.assinatura)?'flex':'none' }}
                status='info'
                onPress={async () => gerarRelatorioVales(funcObj, historicoPagamento, converterTimestamp(historicoPagamento.data_pagamento))}
                accessoryRight={<Entypo name="share" size={20} color={'black'} />}
              >Ver relatório com assinatura</Button>

              <Button appearance='outline' status='info'
                onPress={async () => gerarRelatorioVales(funcObj, historicoPagamento, converterTimestamp(historicoPagamento.data_pagamento))}
                accessoryRight={<Entypo name="share" size={20} color={customTheme['color-info-500']} />}
              >Relatório para assinar</Button>
            </View>
          </View>
        )}
      </Card>
    )
  }

  const { data: historico, isLoading } = useHistoricoPagamentos(funcObj.id, { dataFim, dataInicio })

  return (
    <Layout style={styles.container}>

      <View style={styles.content}>
        <View style={styles.grupoBotoes}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <DatePicker status='warning' setarData={settingInicio} tamanBtn='small' tipo='date' dataPreEstabelecida={dataInicio} />
            <Text style={{ textAlign: 'center', alignSelf: 'center', fontSize: 12 }} category='s1'>até</Text>
            <DatePicker status='warning' setarData={settingFim} tamanBtn='small' tipo='date' dataPreEstabelecida={dataFim} />
          </View>

          <Button
            size='small'
            status='warning'
            appearance='outline'
            accessoryRight={<AntDesign name="reload" size={16} color={customTheme['color-warning-500']} />}
            onPress={() => {
              setDataFim(new Date())
              setDataInicio(new Date(new Date().setDate(1)))
            }}
          >
            Resetar datas
          </Button>
        </View>
        {
          (isLoading) ?
            <Spinner />
            :
            <FlatList
              data={historico}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.contentList}
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
    paddingBottom: 110,
  },

  content: {
    padding: 16,
    gap: 12,
  },

  contentList: {
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

  grupoBotoes: {
    paddingBlock: 10,
    alignItems: 'center',
    gap: 15
  }
});
