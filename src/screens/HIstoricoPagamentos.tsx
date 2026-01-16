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
import { calcularSalarioQuinzena, calcularTotalIncentivos, calcularTotalVales } from '../util/calculos.util';
import { converterParaDate } from '../util/datas.util';
import { converterParaIsoDate, converterTimestamp } from '../util/formatadores.util';
import { gerarRelatorioVales } from '../util/relatorios.util';
import { Funcionario } from '../schema/funcionario.schema';
import { CardGradient } from '../components/CardGradient';

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

  const { data: historico, isLoading } = useHistoricoPagamentos(funcObj.id, { dataFim, dataInicio })

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
                  value={calcularSalarioQuinzena(funcObj)}
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

              {
                historicoPagamento.incentivo.length > 0 &&
                <View style={[styles.summaryCard, styles.sucessCard]}>
                  <Text appearance="hint" category="c1">
                    Valores Incentivos
                  </Text>
                  <DinheiroDisplay
                    value={(calcularTotalIncentivos(historicoPagamento.incentivo))}
                    size="sm"
                    variant="positive"
                  />
                </View>
              }
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

            <View style={{ gap: 8 }}>
              <Button style={{ display: (historicoPagamento.assinatura) ? 'flex' : 'none' }}
                status='info'
                onPress={async () => gerarRelatorioVales(funcObj, historicoPagamento, converterTimestamp(historicoPagamento.data_pagamento))}
                accessoryRight={<Entypo name="share" size={20} color={'black'} />}
              >Ver relatório com assinatura</Button>

              <Button appearance='outline' status='info'
                onPress={async () => gerarRelatorioVales(funcObj, {
                  ...historicoPagamento,
                  assinatura: undefined
                }, converterTimestamp(historicoPagamento.data_pagamento))}
                accessoryRight={<Entypo name="share" size={20} color={customTheme['color-info-500']} />}
              >Relatório para assinar</Button>
            </View>
          </View>
        )}
      </Card>
    )
  }

  return (
    <Layout style={styles.container}>

      <View style={styles.content}>
        <CardGradient styles={styles.filterCard}>
          <View style={styles.filterHeader}>
            <AntDesign name="calendar" size={18} color={customTheme['color-warning-500']} />
            <Text category="s1" style={styles.filterTitle}>
              Período
            </Text>
          </View>

          <View style={styles.dateRow}>
            <DatePicker status='warning' setarData={settingInicio} tamanBtn='small' tipo='date' dataPreEstabelecida={dataInicio} />

            <Text appearance="hint" style={styles.dateSeparator}>
              até
            </Text>

            <DatePicker status='warning' setarData={settingFim} tamanBtn='small' tipo='date' dataPreEstabelecida={dataFim} />

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
            </Button>
          </View>
        </CardGradient>
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

  sucessCard: {
    backgroundColor: 'rgba(46, 184, 114, 0.12)',
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
  },


  filterCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
    gap: 14,
  },

  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  filterTitle: {
    fontWeight: '600',
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  dateSeparator: {
    fontSize: 12,
  },
});
