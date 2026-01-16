import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import {
  Button,
  Layout,
  Spinner,
  Text
} from '@ui-kitten/components';
import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { CardGradient } from '../components/CardGradient';
import { DatePicker } from '../components/DatePicker';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { useTotalDespesasContext } from '../context/TotalDespesasContext';
import { useRestauranteConectado } from '../hooks/useRestaurante';
import { customTheme } from '../theme/custom.theme';
import { converterParaDate } from '../util/datas.util';
import { gerarRelatorioDespesas } from '../util/relatorios.util';

export default function RelatorioFinancas() {
  const { totalDespesas, filtrarPorDatas, resetarDatas, filtrando } = useTotalDespesasContext()

  const { data: restaurante } = useRestauranteConectado()

  const totalGeral = useMemo(() => {
    return totalDespesas?.reduce((acumulador, despesa) => {
      return acumulador + despesa.valor
    }, 0)
  }, [totalDespesas]);

  const [dataInicio, setDataInicio] = useState(new Date(new Date().setDate(1)))
  const settingInicio = (tipo: 'DATA' | 'HORA', dado?: string) => {
    if (tipo === 'DATA' && dado != undefined) setDataInicio(converterParaDate(dado))
  }
  const [dataFim, setDataFim] = useState(new Date())
  const settingFim = (tipo: 'DATA' | 'HORA', dado?: string) => {
    if (tipo === 'DATA' && dado != undefined) setDataFim(converterParaDate(dado))
  }

  useFocusEffect(
    useCallback(() => {
      resetarDatas()
    }, [])
  )

  return (
    <Layout style={styles.container}>
      {/* TOTAL */}
      <CardGradient styles={styles.totalCard}>
        <Text appearance="hint" style={styles.totalLabel}>
          Total no período
        </Text>
        {(filtrando || !totalGeral)?
        <Spinner status='danger'/>
        :
        <DinheiroDisplay
          size="lg"
          variant="negative"
          value={totalGeral || 0}
        />
        }
      </CardGradient>

      {/* FILTRO POR PERÍODO */}
      <CardGradient styles={styles.filterCard}>
        <View style={styles.filterHeader}>
          <AntDesign name="calendar" size={18} color={customTheme['color-warning-500']} />
          <Text category="s1" style={styles.filterTitle}>
            Período
          </Text>
        </View>

        {/* Datas */}
        <View style={styles.dateRow}>
          <DatePicker
            status="warning"
            setarData={settingInicio}
            tamanBtn="small"
            tipo="date"
            dataPreEstabelecida={dataInicio}
          />

          <Text appearance="hint" style={styles.dateSeparator}>
            até
          </Text>

          <DatePicker
            status="warning"
            setarData={settingFim}
            tamanBtn="small"
            tipo="date"
            dataPreEstabelecida={dataFim}
          />
        </View>

        {/* Ações de filtro */}
        <View style={styles.actionRow}>
          <Button
            size="small"
            status="warning"
            appearance="outline"
            style={styles.actionButton}
            accessoryLeft={
              <AntDesign
                name="reload"
                size={16}
                color={customTheme['color-warning-500']}
              />
            }
            onPress={() => {
              setDataFim(new Date());
              setDataInicio(new Date(new Date().setDate(1)));
            }}
          >
            Resetar
          </Button>

          <Button
            size="small"
            status="warning"
            style={styles.actionButton}
            accessoryLeft={
              <AntDesign
                name="filter"
                size={16}
                color="black"
              />
            }
            onPress={() => {
              filtrarPorDatas({ dataFim, dataInicio });
            }}
          >
            Filtrar
          </Button>
        </View>
      </CardGradient>

      {/* COMPARTILHAR */}
      <Button
        appearance="outline"
        status="info"
        style={styles.shareButton}
        accessoryLeft={
          <Entypo
            name="share"
            size={18}
            color={customTheme['color-info-500']}
          />
        }
        onPress={async () =>
          gerarRelatorioDespesas(
            totalDespesas || [],
            restaurante!,
            { dataFim, dataInicio }
          )
        }
      >
        Compartilhar relatório
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },

  /* TOTAL */
  totalCard: {
    padding: 20,
    borderRadius: 20,
    gap: 6,
    backgroundColor: '#1F2933',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  totalLabel: {
    fontSize: 13,
  },

  /* FILTER CARD */
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

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  actionButton: {
    flex: 1,
  },

  /* SHARE */
  shareButton: {
    marginTop: 8,
  },
});
