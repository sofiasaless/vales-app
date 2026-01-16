import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Button, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { AvatarIniciais } from '../components/AvatarIniciais';
import { CardGradient } from '../components/CardGradient';
import { CardGradientPrimary } from '../components/CardGradientPrimary';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { useFuncionariosIncentivoContext } from '../context/FuncionariosIncentivoContext';
import { funcinoarioIncentivosFirestore } from '../firestore/funcionario.incentivo.firestore';
import { incentivoFirestore } from '../firestore/incentivo.firestore';
import { useIncentivoAtivo, useListarFuncionariosDoIncentivo } from '../hooks/useIncentivo';
import { useRestauranteConectado, useRestauranteId } from '../hooks/useRestaurante';
import { Funcionario } from '../schema/funcionario.schema';
import { Incentivo } from '../schema/incentivo.schema';
import { customTheme } from '../theme/custom.theme';
import { alert } from '../util/alertfeedback.util';

export default function RegistroVendaIncentivo() {
  const route = useRoute();
  const { incentObj } = route.params as { incentObj: Incentivo };

  const [incentivo, setIncentivo] = useState<Incentivo>(incentObj)

  const { data: res, isLoading: carregandoRes } = useRestauranteId()
  const { data: funcionarios, isLoading: carregandoFunc, refetch } = useListarFuncionariosDoIncentivo(incentivo.id);

  const { refetch: recarregarIncentivo } = useIncentivoAtivo(res?.uid || '');

  const { funcionariosIncentivo, incrementar } = useFuncionariosIncentivoContext()

  const [isLoading, setIsLoading] = useState(false)

  const [isConfirmando, setIsConfirmando] = useState(false)

  const confirmarGanhador = async (funcionario: Funcionario, idFuncInce: string) => {
    try {
      setIsConfirmando(true)
      await incentivoFirestore.declararGanhador(incentivo, funcionario, idFuncInce);

      setIncentivo(prev => ({
        ...prev,
        ganhador_nome: funcionario.nome,
        ganhador_ref: idFuncInce
      }))

      recarregarIncentivo()
    } catch (error: any) {
      alert('Não foi possível declarar ganhador', error)
    } finally {
      setIsConfirmando(false)
    }
  }

  const exibirGanhador = (funcionario: Funcionario, idFuncInce: string) => {
    Alert.alert('🎉 Temos um ganhador!',
      `${funcionario.nome} atingiu a meta de vendas do incentivo!`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar ganhador',
          onPress: async () => {
            await confirmarGanhador(funcionario, idFuncInce);
          }
        }
      ]
    );
  }

  const verificarGanhador = () => {
    funcionariosIncentivo.forEach((cont, key) => {
      if (cont >= incentivo.meta) {
        const ganhador = funcionarios?.find((f) => f.id === key)
        if (ganhador) {
          exibirGanhador(ganhador.funcionario_obj!, key);
        }
      }
    })
  }

  useEffect(() => {
    if (incentivo.ganhador_nome === null) verificarGanhador();
  }, [])

  const [incrementando, setIncrementando] = useState(false)
  const handleIncrementar = async (idFuncInc: string, valor: number, counter: number) => {
    try {
      setIncrementando(true)
      await funcinoarioIncentivosFirestore.incrementarContador(idFuncInc, valor);
      if (valor > 0 && (counter + valor) >= incentivo.meta) {
        const ganhador = funcionarios?.find((f) => f.id === idFuncInc)?.funcionario_obj
        if (ganhador) exibirGanhador(ganhador, idFuncInc);
      }
      incrementar(idFuncInc, valor);
      refetch()
    } catch (error: any) {
      alert('Erro ao incrementar venda no funcionário', error)
    } finally {
      setIncrementando(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      recarregarIncentivo()
      refetch()
    }, [carregandoRes])
  );

  return (
    <Layout style={styles.container}>
      <CardGradientPrimary styles={styles.incentiveCard}>
        <View style={styles.incentiveHeader}>
          <Feather name="target" size={16} color='white' />
          <Text category="s2">Meta do Incentivo</Text>
        </View>

        <View style={styles.incentiveRow}>
          <Text>
            {incentivo?.meta} vendas para ganhar
          </Text>
          <DinheiroDisplay value={incentivo.valor_incentivo} variant='positive' />
        </View>
      </CardGradientPrimary>

      {incentivo.ganhador_nome && (
        <View style={styles.winnerBanner}>
          <MaterialCommunityIcons name="crown" size={26} color="#16A34A" />
          <View>
            <Text style={styles.winnerTitle}>
              Temos um ganhador!
            </Text>
            <Text style={styles.winnerName}>
              {incentivo.ganhador_nome}
            </Text>
          </View>
        </View>
      )}

      {
        (carregandoFunc) ?
          <Spinner />
          :
          <FlatList
            data={funcionarios}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const counter = funcionariosIncentivo.get(item.id)?.valueOf() || 0;
              const isWinner = incentivo.ganhador_ref === item.id;
              const progress = Math.min(
                (counter / incentivo?.meta) * 100,
                100
              );

              return (
                <CardGradient
                  styles={[
                    styles.employeeCard,
                    isWinner && styles.employeeWinner,
                  ]}
                >
                  <AvatarIniciais img_url={item.funcionario_obj?.foto_url} name={item.funcionario_obj?.nome || ''} size="sm" />

                  <View style={styles.employeeInfo}>
                    <View style={styles.employeeHeader}>
                      <Text category="s1" numberOfLines={1}>
                        {item.funcionario_obj?.nome}
                      </Text>
                      {isWinner && (
                        <MaterialCommunityIcons name="crown"
                          size={18}
                          color="#16A34A"
                        />
                      )}
                    </View>

                    <Text appearance="hint" style={styles.role}>
                      {item.funcionario_obj?.cargo}
                    </Text>

                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progress}%`,
                            backgroundColor: isWinner
                              ? '#16A34A'
                              : customTheme['color-warning-500'],
                          },
                        ]}
                      />
                    </View>

                    <Text appearance="hint" style={styles.progressText}>
                      {item.contador} / {incentivo.meta} vendas
                    </Text>

                    {
                      (counter === incentObj.meta) && (!isWinner) &&
                      <Button style={{ marginTop: 8 }} appearance='outline' status='warning' size='tiny'
                        disabled={isConfirmando}
                        onPress={() => confirmarGanhador(item.funcionario_obj!, item.id)}
                        accessoryRight={<MaterialCommunityIcons name="trophy-variant" size={12} color={customTheme['color-warning-500']} />}
                      >{(isConfirmando)?'Confirmando...':'Confirmar ganhador'}</Button>
                    }
                  </View>

                  <View style={styles.counterBox}>
                    <Button
                      size="tiny"
                      disabled={incrementando || (!!incentivo.ganhador_nome)}
                      onPress={() => handleIncrementar(item.id, 1, counter)}
                    >
                      <Feather name="plus" size={14} />
                    </Button>

                    <Text style={styles.counterValue}>
                      {counter}
                    </Text>

                    <Button
                      size="tiny"
                      appearance="outline"
                      disabled={counter === 0 || incrementando || (!!incentivo.ganhador_nome)}
                      onPress={() => handleIncrementar(item.id, -1, counter)}
                    >
                      <Feather name="minus" size={14} />
                    </Button>
                  </View>
                </CardGradient>
              );
            }}
          />
      }

      {incentivo.ganhador_nome &&
        <View>
          <Button appearance='outline' status='danger' disabled={isLoading}
            onPress={async () => {
              try {
                setIsLoading(true)
                await incentivoFirestore.cancelarGanhador(incentivo, incentivo.ganhador_ref || '');

                setIncentivo(prev => ({
                  ...prev,
                  ganhador_nome: undefined,
                  ganhador_ref: undefined
                }))

                recarregarIncentivo()
              } catch (error: any) {
                alert('Não foi possível cancelar o ganhador', error)
              } finally {
                setIsLoading(false)
              }
            }}
          >{(isLoading)?'Cancelando...':'Cancelar ganhador'}</Button>
        </View>
      }
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  /* Empty */
  emptyBox: {
    marginTop: 80,
    alignItems: 'center',
    gap: 12,
  },

  emptyTitle: {
    fontSize: 18,
  },

  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },

  emptyButton: {
    marginTop: 16,
  },

  /* Incentive */
  incentiveCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: customTheme['border-color-primary'],
    marginBottom: 12,
  },

  incentiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  incentiveTitle: {
    color: '#6366F1',
    fontWeight: '600',
  },

  incentiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  incentiveValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
  },

  /* Winner */
  winnerBanner: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(22,163,74,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(22,163,74,0.3)',
    marginBottom: 12,
    alignItems: 'center',
  },

  winnerTitle: {
    color: '#16A34A',
    fontWeight: '600',
  },

  winnerName: {
    fontSize: 16,
    fontWeight: '700',
  },

  /* List */
  list: {
    gap: 10,
    paddingBottom: 120,
  },

  employeeCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
  },

  employeeWinner: {
    borderWidth: 1,
    borderColor: 'rgba(22,163,74,0.5)',
  },

  employeeInfo: {
    flex: 1,
  },

  employeeHeader: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },

  role: {
    fontSize: 12,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#1F2933',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 6,
  },

  progressFill: {
    height: '100%',
  },

  progressText: {
    fontSize: 11,
    marginTop: 4,
  },

  counterBox: {
    alignItems: 'center',
    gap: 6,
  },

  counterValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});
