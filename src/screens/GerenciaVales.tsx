import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  Card,
  Input,
  Layout,
  Text
} from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { AppModal } from '../components/AppModal';
import { AvatarIniciais } from '../components/AvatarIniciais';
import { Carregando } from '../components/Carregando';
import { ItemVale } from '../components/ItemVale';
import { useEventoAlteracoesContext } from '../context/EventoAlteracaoContext';
import { useFuncionarios } from '../hooks/useFuncionarios';
import { useGerenteConectado } from '../hooks/useGerente';
import { useVales } from '../hooks/useVales';
import { RootStackParamList } from '../routes/StackRoutes';
import { Gerente } from '../schema/gerente.schema';
import { Vale, ValeDinheiroPostRequestBody } from '../schema/vale.shema';
import { customTheme } from '../theme/custom.theme';
import { alert } from '../util/alertfeedback.util';
import { calcularTotalVales } from '../util/calculos.util';
import { parseMoedaBR } from '../util/formatadores.util';

type RouteParams = {
  idFunc: string;
};

const emptyVale: ValeDinheiroPostRequestBody = {
  descricao: '',
  preco_unit: 0
}

export const GerenciaVales = () => {
  const { data: gerente } = useGerenteConectado()
  const styles = style(gerente);

  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { idFunc } = route.params as RouteParams;

  const [formVale, setFormVale] = useState<ValeDinheiroPostRequestBody>(emptyVale)

  const [cashError, setCashError] = useState('');

  const { encontrarPorId, isLoadingF, funcionarioFoco } = useFuncionarios()

  const [modalVisible, setModalVisible] = useState(false);

  const { adicionarVale, isLoading: carregando, removerVale, isLoadingVales, listarVales, vales } = useVales()

  const [precoTexto, setPrecoTexto] = useState('');

  const handleRemoveItem = async (valeToRemove: Vale) => {
    Alert.alert(`Confirmar remoção`, `Tem certeza que quer remover "${valeToRemove.descricao}"?`, [
      {
        text: "Cancelar"
      },
      {
        text: "Confirmar",
        onPress: async () => {
          await removerVale(idFunc, valeToRemove);
          listarVales(idFunc);
        }
      }
    ])
  };

  const handleAddCashVoucher = async () => {

    if (formVale.preco_unit <= 0) {
      setCashError('Informe um valor válido');
      return;
    }

    if (formVale.descricao === '') {
      setCashError('Informe uma descrição válida');
      return;
    }

    const res = await adicionarVale(idFunc, {
      id: Math.random().toString(),
      data_adicao: new Date(),
      quantidade: 1,
      ...formVale
    })

    if (res.ok) {
      listarVales(idFunc);
    } else {
      alert('Ocorreu um erro ao adicionar os vales', res.message)
    }

    setModalVisible(false)
    setFormVale(emptyVale)
    setCashError('');
    setPrecoTexto('')
  };

  const { novaAdicaoVale } = useEventoAlteracoesContext()

  useEffect(() => {
    encontrarPorId(idFunc);
    listarVales(idFunc)
  }, [idFunc, novaAdicaoVale])

  return (
    (isLoadingF) ?
      <Carregando />
      :
      <Layout style={styles.container}>
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
          <Layout level='1' style={styles.card}>
            <View style={styles.employeeHeader}>
              <AvatarIniciais img_url={funcionarioFoco?.foto_url} name={funcionarioFoco?.nome || ''} />
              <View style={styles.employeeInfo}>
                <Text category="h6">{funcionarioFoco?.nome}</Text>
                <Text appearance="hint">{funcionarioFoco?.cargo}</Text>
                <Text appearance="hint" category="c1">
                  {funcionarioFoco?.tipo === 'DIARISTA'
                    ? 'Diarista'
                    : 'Fixo (Quinzenas)'}
                </Text>
              </View>
            </View>
          </Layout>

          <Button onPress={() => setModalVisible(true)} size='small' appearance='outline'>Adicionar vale em dinheiro</Button>

          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Feather name="shopping-bag" size={18} color={customTheme['color-primary-400']} />
              <Text category="h6">Vale Atual</Text>
            </View>
            <Button
              size="small"
              accessoryLeft={<AntDesign name="plus" size={15} color="black" />}
              onPress={() => navigation.navigate('Cardapio', { idFunc: idFunc })}
            >
              Selecionar itens
            </Button>
          </View>

          <View style={{ maxHeight: 290, minHeight: 190 }}>
            {(vales) ?
              (isLoadingVales)
                ?
                <Carregando />
                :
                vales?.length > 0 ? (
                  <FlatList
                    data={vales}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <ItemVale item={item} showControls onExclude={handleRemoveItem} />
                    )}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <Card style={styles.emptyCard}>
                    <Text appearance="hint" style={styles.emptyText}>
                      Nenhum item no vale
                    </Text>
                  </Card>
                )
              :
              <></>
            }
          </View>

          <Layout level='1' style={styles.card}>
            <View style={styles.totalRow}>
              <Text category="s1">Total do Vale</Text>
              <Text category="s1">R$ {calcularTotalVales(vales).toFixed(2)}</Text>
            </View>
          </Layout>

          <Button
            style={styles.controleUsuario}
            size="medium"
            onPress={() =>
              navigation.navigate('ResumoPagamento', {
                funcObj: {
                  ...funcionarioFoco!,
                  vales: vales!
                }
              })
            }
            accessoryLeft={<Entypo name="credit-card" size={20} color="black" />}
          >
            Pagar Funcionário
          </Button>

          <View style={[styles.actionRow, styles.controleUsuario]}>
            <Button
              appearance="outline"
              status='basic'
              size='small'
              style={styles.actionButton}
              accessoryLeft={<Feather name="user" size={15} color={customTheme['text-basic-color']} />}
              onPress={() =>
                navigation.navigate('Detalhes', { idFunc: idFunc })
              }
            >
              Detalhes
            </Button>

            <Button
              size='small'
              status='basic'
              appearance="outline"
              style={styles.actionButton}
              accessoryLeft={<MaterialCommunityIcons name="history" size={16} color={customTheme['text-basic-color']} />}
              onPress={() =>
                navigation.navigate('Historico', { funcObj: funcionarioFoco! })
              }
            >
              Histórico
            </Button>
          </View>
        </ScrollView>

        <AppModal onClose={() => setModalVisible(false)} visible={modalVisible}>
          <Text category="h6" style={styles.modalTitle}>
            Preencha abaixo
          </Text>

          <Input
            label="Valor (R$)"
            size="small"
            placeholder="0,00"
            value={precoTexto}
            keyboardType="decimal-pad"
            onChangeText={(text) => {
              setPrecoTexto(text);

              const numero = parseMoedaBR(text);

              if (numero !== null) {
                setFormVale(prev => ({
                  ...prev,
                  preco_unit: numero
                }));
              }
            }}
            status={cashError ? 'danger' : 'basic'}
            style={styles.input}
          />

          <Input
            label="Descrição"
            size='small'
            placeholder="Ex: Adiantamento"
            value={formVale.descricao}
            onChangeText={(text) => {
              setFormVale((prev) => (({
                ...prev,
                descricao: text
              })))
            }}
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Button
              size='small'
              appearance="outline"
              onPress={() => setModalVisible(false)}
            >
              Cancelar
            </Button>
            <Button onPress={handleAddCashVoucher} size='small'>
              Confirmar
            </Button>
          </View>
        </AppModal>
      </Layout>
  );
};

const style = (gerente: Gerente | null | undefined) => {
  return StyleSheet.create({
    controleUsuario: {
      display: (gerente) ? ((gerente.tipo === 'AUXILIAR') ? 'none' : 'flex') : 'flex'
    },
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
      gap: 18
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    notFoundText: {
      marginTop: 12,
      marginBottom: 16,
    },
    backButton: {
      marginTop: 8,
    },
    card: {
      padding: 18,
      // marginTop: 10,
      // marginBottom: 12,
      borderRadius: 16,
      borderWidth: 0.5,
      borderColor: customTheme['text-disabled-color'],
      backgroundColor: customTheme['color-basic-700']
    },
    employeeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    employeeInfo: {
      marginLeft: 12,
      flex: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    emptyCard: {
      padding: 24,
      alignItems: 'center',
      marginBottom: 16,
    },
    emptyText: {
      marginTop: 8,
    },
    sectionTitle: {
      marginBottom: 12,
    },
    input: {
      marginTop: 8,
    },
    errorText: {
      marginTop: 4,
    },
    addButton: {
      marginTop: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actionRow: {
      flexDirection: 'row',
    },
    actionButton: {
      flex: 1,
      marginHorizontal: 4,
    },
    containerList: {
      maxHeight: 320,
    },
    contentContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    modalTitle: {
      marginBottom: 12,
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 16,
    },

    deleteText: {
      marginVertical: 12,
    },
  });
}
