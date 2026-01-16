import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, Divider, Input, Layout, Modal, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CardGradient } from '../components/CardGradient';
import { CardGradientPrimary } from '../components/CardGradientPrimary';
import { DatePicker } from '../components/DatePicker';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { incentivoFirestore } from '../firestore/incentivo.firestore';
import { useIncentivoAtivo, useListarIncentivos } from '../hooks/useIncentivo';
import { RootStackParamList } from '../routes/StackRoutes';
import { customTheme } from '../theme/custom.theme';
import { alert } from '../util/alertfeedback.util';
import { converterParaDate } from '../util/datas.util';
import { converterTimestamp } from '../util/formatadores.util';
import { useFuncionariosRestaurante } from '../hooks/useFuncionarios';
import { Incentivo } from '../schema/incentivo.schema';

export const Incentivos = () => {
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { idRest } = route.params as { idRest: string };

  const { data: incentivos, isLoading: carregandoIncentivo, refetch } = useListarIncentivos(idRest);
  const { data: incentivo_ativo, isLoading: carregandoIncentivoAtivo, refetch: recarregarAtivo } = useIncentivoAtivo(idRest);

  const { data: funcionarios } = useFuncionariosRestaurante(idRest)

  const [dataExpiracao, setDataExpiracao] = useState<Date>(new Date)
  const settingExpiracao = (tipo: 'DATA' | 'HORA', dado?: string) => {
    if (tipo === 'DATA' && dado != undefined) {
      setDataExpiracao(converterParaDate(dado))
    }
  }

  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    descricao: '',
    valor_incentivo: '',
    meta: '',
  });

  const [editingIncentivo, setEditingIncentivo] = useState<Incentivo | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const handleAdicionarIncentivo = async () => {
    try {
      setIsLoading(true)
      if (!form.descricao || !form.valor_incentivo || !form.meta) return;

      if (funcionarios) {
        await incentivoFirestore.criar(idRest, {
          data_expiracao: dataExpiracao,
          valor_incentivo: Number(form.valor_incentivo),
          meta: Number(form.meta),
          descricao: form.descricao
        }, funcionarios);
      } else {
        throw new Error("Necessário pelo menos 1 funcionário para começar incentivo")
      }

      await recarregarAtivo()
      setForm({ descricao: '', valor_incentivo: '', meta: '' });
      setVisible(false);
    } catch (error: any) {
      alert('Não foi possível começar incentivo', error)
    } finally {
      setIsLoading(false)
    }
  };

  const handleEditarIncentivo = async () => {
    try {
      setIsLoading(true)
      if (!form.descricao || !form.valor_incentivo || !form.meta) return;

      await incentivoFirestore.atualizar(editingIncentivo?.id || '', {
        data_expiracao: dataExpiracao,
        valor_incentivo: Number(form.valor_incentivo),
        meta: Number(form.meta),
        descricao: form.descricao
      })

      await recarregarAtivo()
      setForm({ descricao: '', valor_incentivo: '', meta: '' });
      setVisible(false);
    } catch (error: any) {
      alert('Não foi possível começar incentivo', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout style={styles.container}>
      {incentivo_ativo && (
        <TouchableOpacity onPress={() => navigator.navigate('RegistroVendaIncentivo', { incentObj: incentivo_ativo })}>
          <CardGradientPrimary styles={styles.activeCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <MaterialCommunityIcons name="star-shooting" size={20} color={customTheme['color-primary-500']} />
                <Text category="s1" status='primary'>Incentivo do momento</Text>
              </View>
              <DinheiroDisplay value={incentivo_ativo.valor_incentivo} />
            </View>

            <Text category='s2'>{incentivo_ativo.descricao}</Text>

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <View style={styles.subTxt}>
                <MaterialIcons name="star-purple500" size={13} color={customTheme['text-hint-color']} />
                <Text category='c1' appearance="hint">Meta: {incentivo_ativo.meta}</Text>
              </View>
              <View style={styles.subTxt}>
                <MaterialIcons name="calendar-month" size={13} color={customTheme['text-hint-color']} />
                <Text category='c1' appearance="hint">Expira em {converterTimestamp(incentivo_ativo.data_expiracao).toLocaleDateString()}</Text>
              </View>
            </View>

            {incentivo_ativo.ganhador_nome &&
              <View style={styles.badgeGanhador}>
                <MaterialCommunityIcons name="crown" size={20} color={customTheme['color-success-600']} />
                <Text category='s2' status='success'>{incentivo_ativo.ganhador_nome}</Text>
              </View>
            }

            <Divider style={{ backgroundColor: customTheme['border-color-primary'], marginBlock: 5 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button size='small' status='warning'
                accessoryLeft={<MaterialCommunityIcons name="check-decagram" size={16} color="black" />}
                onPress={() => {
                  Alert.alert('Encerrar Incentivo',
                    'Ao encerrar o incentivo, você não poderá editá-lo ou ver as vendas relacionadas a ele.',
                    [
                      {
                        text: 'Cancelar'
                      },
                      {
                        text: 'Confirmar',
                        onPress: async () => {
                          try {
                            await incentivoFirestore.atualizar(incentivo_ativo.id, {
                              status: false
                            });
                            await refetch()
                            await recarregarAtivo()
                          } catch (error) {
                            console.error(error)
                          }
                        }
                      }
                    ]
                  )
                }}
              >Encerrar</Button>

              <TouchableOpacity style={styles.btnEditar}
                onPress={() => {
                  setEditingIncentivo(incentivo_ativo);
                  setForm({
                    descricao: incentivo_ativo?.descricao || '',
                    meta: incentivo_ativo?.meta.toString() || '',
                    valor_incentivo: incentivo_ativo?.valor_incentivo.toString() || ''
                  })
                  setDataExpiracao(converterTimestamp(incentivo_ativo.data_expiracao))
                  setVisible(true)
                }}
              >
                <MaterialCommunityIcons name="clipboard-edit-outline" size={15} color={customTheme['color-warning-500']} />
              </TouchableOpacity>
            </View>
          </CardGradientPrimary>
        </TouchableOpacity>
      )}

      <Button
        style={styles.button}
        disabled={!!incentivo_ativo}
        onPress={() => setVisible(true)}
      >
        Começar Novo Incentivo
      </Button>

      <View style={{ flexDirection: 'row', marginVertical: 17, alignItems: 'center', gap: 8 }}>
        <MaterialIcons name="history" size={20} color={customTheme['text-basic-color']} />
        <Text category="h6">Histórico de Incentivos</Text>
      </View>

      <FlatList
        data={incentivos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={(incentivo) => (
          <CardGradient colors_one='4' colors_two='2' key={incentivo.item.id} styles={styles.historyCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ flex: 1 }} category="s1">{incentivo.item.descricao}</Text>
              <DinheiroDisplay size='md' value={incentivo.item.valor_incentivo} variant='positive' />
            </View>

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <View style={styles.subTxt}>
                <MaterialIcons name="star-purple500" size={13} color={customTheme['text-hint-color']} />
                <Text category='s2' appearance="hint">Meta: {incentivo.item.meta}</Text>
              </View>
              <View style={styles.subTxt}>
                <MaterialIcons name="calendar-month" size={13} color={customTheme['text-hint-color']} />
                <Text category='s2' appearance="hint">Expira em: {converterTimestamp(incentivo.item.data_expiracao).toLocaleDateString()}</Text>
              </View>
            </View>

            {incentivo.item.ganhador_nome ? (
              <View style={styles.badgeGanhador}>
                <MaterialCommunityIcons name="crown" size={20} color={customTheme['color-success-600']} />
                <Text category='s2' status='success'>{incentivo.item.ganhador_nome}</Text>
              </View>
            ) : (
              <Text category='c2' appearance="hint">Expirado sem ganhador</Text>
            )}
          </CardGradient>
        )}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={{ textAlign: 'center' }} appearance="hint">Nenhum incentivo no histórico</Text>
          </Card>
        }
        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
      />

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setVisible(false)
          setEditingIncentivo(null);
        }}
      >
        <Card style={styles.cardModal}>
          <Text category="h6">{(editingIncentivo) ? 'Editar incentivo do momento' : 'Novo Incentivo'}</Text>

          <Input
            label="Descrição *"
            value={form.descricao}
            onChangeText={v => setForm({ ...form, descricao: v })}
            style={styles.input}
          />

          <Input
            label="Valor do prêmio *"
            keyboardType="numeric"
            value={form.valor_incentivo}
            disabled={(!!editingIncentivo?.ganhador_nome)}
            onChangeText={v => setForm({ ...form, valor_incentivo: v })}
            style={styles.input}
            caption={(editingIncentivo?.ganhador_nome) ? 'Para alterar o valor do prêmio, remova o ganhador atual.' : ''}
          />

          <Input
            label="Meta *"
            keyboardType="numeric"
            value={form.meta}
            disabled={(!!editingIncentivo?.ganhador_nome)}
            onChangeText={v => setForm({ ...form, meta: v })}
            style={styles.input}
            caption={(editingIncentivo?.ganhador_nome) ? 'Para alterar a meta, remova o ganhador atual.' : ''}
          />

          <View style={[styles.input, { gap: 5 }]}>
            <Text category='c1' appearance='hint'>Data de expiração *</Text>
            <DatePicker dataPreEstabelecida={dataExpiracao} setarData={settingExpiracao} tamanBtn='small' tipo='date' />
          </View>

          <Button onPress={() => {
            if (editingIncentivo) {
              handleEditarIncentivo()
            } else {
              handleAdicionarIncentivo()
            }
          }} disabled={isLoading}
          >{(isLoading) ? 'Adicionando...' : (editingIncentivo) ? 'Salvar alterações' : 'Criar Incentivo'}</Button>
        </Card>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  button: { marginVertical: 12 },
  activeCard: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    gap: 5
  },
  historyCard: {
    padding: 15,
    gap: 5,
    borderRadius: 16,
  },
  emptyCard: { padding: 24, alignItems: 'center' },
  input: { marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  cardModal: {
    width: 300, maxWidth: 300, minWidth: 200,
  },
  subTxt: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center'
  },
  badgeGanhador: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 5,
    gap: 5,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customTheme['border-color-primary'],
    backgroundColor: '#2eb8731a'
  },
  btnEditar: {
    backgroundColor: '#d488062c',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center',
    borderRadius: 100
  }
});