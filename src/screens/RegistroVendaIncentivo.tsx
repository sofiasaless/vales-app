import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Button, Layout, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { AvatarIniciais } from '../components/AvatarIniciais';
import { CardGradient } from '../components/CardGradient';
import { CardGradientPrimary } from '../components/CardGradientPrimary';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { funcionarioFirestore } from '../firestore/funcionario.firestore';
import { useFuncionariosRestaurante } from '../hooks/useFuncionarios';
import { useRestauranteConectado } from '../hooks/useRestaurante';
import { Incentivo } from '../schema/incentivo.schema';
import { customTheme } from '../theme/custom.theme';
import { alert } from '../util/alertfeedback.util';
import { useFuncionariosIncentivoContext } from '../context/FuncionariosIncentivoContext';
import { Funcionario } from '../schema/funcionario.schema';
import { incentivoFirestore } from '../firestore/incentivo.firestore';
import { useIncentivoAtivo } from '../hooks/useIncentivo';

export default function RegistroVendaIncentivo() {
  const route = useRoute();
  const { incentObj } = route.params as { incentObj: Incentivo };

  const [incentivo, setIncentivo] = useState<Incentivo>(incentObj)

  const { funcionariosIncentivo, incrementar } = useFuncionariosIncentivoContext()

  const { data: res, isLoading: carregandoRes } = useRestauranteConectado()
  const { data: employees, isLoading, refetch } = useFuncionariosRestaurante(res?.id || '')

  const { refetch: recarregarIncentivo } = useIncentivoAtivo(res?.id || '');

  const exibirGanhador = (funcionario: Funcionario) => {
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
            try {
              incentivoFirestore.declararGanhador(incentivo.id, funcionario.nome, funcionario.id);

              setIncentivo(prev => ({
                ...prev,
                ganhador_nome: funcionario.nome,
                ganhador_ref: funcionario.id
              }))

              recarregarIncentivo()
            } catch (error) {
              console.error(error)
            }
          }
        }
      ]
    );
  }

  const verificarGanhador = () => {
    funcionariosIncentivo.forEach((cont, key) => {
      if (cont >= incentivo.meta) {
        const ganhador = employees?.find((f) => f.id === key)
        if (ganhador) {
          exibirGanhador(ganhador);
        }
      }
    })
  }

  useEffect(() => {
    if (!incentivo) return;

    if (!employees) return;

  }, [employees, incentivo]);

  useEffect(() => {
    if (!incentivo.ganhador_nome) verificarGanhador();
  }, [])

  const [incrementando, setIncrementando] = useState(false)
  const handleIncrementar = async (funcionario: Funcionario, valor: number, counter: number) => {
    try {
      setIncrementando(true)
      await funcionarioFirestore.incrementarIncentivo(funcionario.id, valor);
      if (valor > 0 && (counter + valor) >= incentivo.meta) {
        exibirGanhador(funcionario)
      }
      incrementar(funcionario.id, valor);
      refetch()
    } catch (error: any) {
      alert('Erro ao incrementar venda no funcionário', error)
    } finally {
      setIncrementando(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
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

      <FlatList
        data={employees}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const counter = funcionariosIncentivo.get(item.id) || 0;
          const isWinner = incentivo?.ganhador_ref === item.id;
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
              <AvatarIniciais img_url={item.foto_url} name={item.nome} size="sm" />

              <View style={styles.employeeInfo}>
                <View style={styles.employeeHeader}>
                  <Text category="s1" numberOfLines={1}>
                    {item.nome}
                  </Text>
                  {isWinner && (
                    <MaterialCommunityIcons name="crown"
                      size={18}
                      color="#16A34A"
                    />
                  )}
                </View>

                <Text appearance="hint" style={styles.role}>
                  {item.cargo}
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
                  {counter} / {incentivo.meta} vendas
                </Text>
              </View>

              <View style={styles.counterBox}>
                <Button
                  size="tiny"
                  disabled={(incentivo.ganhador_nome !== undefined) || incrementando}
                  onPress={() => handleIncrementar(item, 1, counter)}
                >
                  <Feather name="plus" size={14} />
                </Button>

                <Text style={styles.counterValue}>
                  {counter}
                </Text>

                <Button
                  size="tiny"
                  appearance="outline"
                  disabled={counter === 0 || (incentivo.ganhador_nome !== undefined) || incrementando}
                  onPress={() => handleIncrementar(item, -1, counter)}
                >
                  <Feather name="minus" size={14} />
                </Button>
              </View>
            </CardGradient>
          );
        }}
      />

      {incentivo.ganhador_nome &&
        <View>
          <Button appearance='outline' status='danger' size='tiny'>Cancelar ganhador</Button>
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
