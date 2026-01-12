import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useRoute } from '@react-navigation/native';
import {
  Button,
  ButtonGroup,
  Card,
  Input,
  Layout,
  Modal,
  Spinner,
  Text
} from '@ui-kitten/components';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import { CardGradient } from '../components/CardGradient';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { useTotalDespesasContext } from '../context/TotalDespesasContext';
import { despesaFirestore } from '../firestore/despesa.firestore';
import { useListarDespesas } from '../hooks/useDespesaFinancas';
import { colorMap, iconMap } from '../maps/financas.map';
import { CategoriaFinancas, DespesaPostRequestBody } from '../schema/financa.schema';
import { customTheme } from '../theme/custom.theme';
import { alert } from '../util/alertfeedback.util';
import { converterParaIsoDate, formatCurrency } from '../util/formatadores.util';
import { DatePicker } from '../components/DatePicker';
import { converterParaDate } from '../util/datas.util';

export default function FinancasDetalhe() {
  const route = useRoute<any>();
  const { categoriaObj } = route.params as { categoriaObj: CategoriaFinancas };

  const [modalOpen, setModalOpen] = useState(false);
  const [novaDespesa, setNovaDespesa] = useState<DespesaPostRequestBody>({
    descricao: '',
    valor: 0,
  });
  const [valor, setValor] = useState('')

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

  const { data: despesas, isLoading, refetch } = useListarDespesas(categoriaObj.id, { dataFim, dataInicio })

  const { adicionarNovaDespesa } = useTotalDespesasContext()

  const totalPeriodo = useMemo(() => {
    return despesas?.reduce((acumulador, atual) => {
      return acumulador + atual.valor;
    }, 0)
  }, [despesas])

  const [isAdicionando, setIsAdicionando] = useState(false)
  const adicionarDespesa = async () => {
    try {
      setIsAdicionando(true)
      if (!novaDespesa.descricao.trim() || valor === '') return;

      novaDespesa.valor = Number(valor);
      await despesaFirestore.criar(categoriaObj.id, novaDespesa);
      setDataFim(new Date())
      await refetch()
      adicionarNovaDespesa(novaDespesa)
      setNovaDespesa({ descricao: '', valor: 0 });
      setValor('')
      setModalOpen(false);
    } catch (error: any) {
      alert('Ocorreu um erro ao adicionar despesa', error)
    } finally {
      setIsAdicionando(false)
    }
  };

  if (!categoriaObj) {
    return (
      <Layout style={styles.container}>
        <Text appearance="hint">Categoria não encontrada</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>

      <CardGradient styles={styles.summary}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: colorMap[categoriaObj.cor] },
          ]}
        >
          <Feather
            name={iconMap[categoriaObj.icone as keyof typeof iconMap]}
            size={22}
            color="#FFF"
          />
        </View>

        <View>
          <Text appearance="hint">Total em {categoriaObj.descricao}</Text>
          <DinheiroDisplay variant='negative' size='lg' value={totalPeriodo || 0} />
        </View>
      </CardGradient>

      <Button
        size="small"
        style={styles.addButton}
        accessoryLeft={<Feather name="plus" size={16} />}
        onPress={() => setModalOpen(true)}
      >
        Nova Despesa
      </Button>

      {
        (isLoading) ?
          <Spinner />
          :
          <FlatList
            data={despesas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text appearance="hint" style={styles.empty}>
                Nenhuma despesa neste período
              </Text>
            }
            renderItem={({ item }) => (
              <CardGradient styles={styles.expenseCard}>
                <View>
                  <Text category="s1">{item.descricao}</Text>
                  <Text appearance="hint" style={styles.date}>
                    {converterParaIsoDate(item.data_criacao)}
                  </Text>
                </View>

                <Text status="danger" style={styles.amount}>
                  {formatCurrency(item.valor)}
                </Text>
              </CardGradient>
            )}
            removeClippedSubviews
            windowSize={5}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
          />
      }

      <View style={styles.grupoBotoes}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <DatePicker status='warning' setarData={settingInicio} tamanBtn='small' tipo='date' dataPreEstabelecida={dataInicio} />
          <Text style={{ textAlign: 'center', alignSelf: 'center', fontSize: 12 }} category='s1'>até</Text>
          <DatePicker status='warning' setarData={settingFim} tamanBtn='small' tipo='date' dataPreEstabelecida={dataFim} />
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
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

          <Button size='small' appearance='outline' status='info'
            accessoryRight={<Entypo name="share" size={20} color={customTheme['color-info-500']} />}
          >Compartilhar relatório</Button>
        </View>
      </View>

      <Modal
        visible={modalOpen}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalOpen(false)}
      >
        <Card disabled style={{ padding: 10, alignSelf: 'center' }}>
          <Text category="h6">Nova Despesa</Text>

          <Input
            status='primary'
            label="Descrição"
            placeholder="Ex: Arroz, Bebidas..."
            value={novaDespesa.descricao}
            onChangeText={(t) =>
              setNovaDespesa({ ...novaDespesa, descricao: t })
            }
          />

          <Input
            status='primary'
            label="Valor"
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
          />

          <View style={styles.modalActions}>
            <Button
              appearance="ghost"
              status='danger'
              onPress={() => setModalOpen(false)}
            >
              Cancelar
            </Button>

            <Button disabled={isAdicionando} onPress={adicionarDespesa}>
              {(isAdicionando) ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </View>
        </Card>
      </Modal>
    </Layout >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 0.8,
    borderColor: customTheme['text-disabled-color']
  },

  iconBox: {
    padding: 14,
    borderRadius: 14,
  },

  select: {
    marginBottom: 12,
  },

  addButton: {
    marginBottom: 12,
  },

  list: {
    gap: 8,
  },

  expenseCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  date: {
    fontSize: 12,
  },

  amount: {
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
  },

  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },

  grupoBotoes: {
    paddingBlock: 15,
    alignItems: 'center',
    gap: 15
  }
});