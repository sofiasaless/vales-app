import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Layout, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AvatarIniciais } from '../components/AvatarIniciais';
import { CardGradient } from '../components/CardGradient';
import { CardGradientPrimary } from '../components/CardGradientPrimary';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { useIncentive } from '../context/InvenctiveContext';
import { useFuncionariosRestaurante } from '../hooks/useFuncionarios';
import { useRestauranteConectado } from '../hooks/useRestaurante';
import { customTheme } from '../theme/custom.theme';
import { alert } from '../util/alertfeedback.util';

export default function RegistroVendaIncentivo() {
  const {
    state: incentiveState,
    getActiveIncentive,
    getEmployeeCounter,
    incrementCounter,
    decrementCounter,
    setWinner,
  } = useIncentive();

  const activeIncentive = getActiveIncentive();

  const { data: res, isLoading: carregandoRes } = useRestauranteConectado()
  const { data: employees, isLoading, refetch } = useFuncionariosRestaurante(res?.id || '')

  useEffect(() => {
    if (!activeIncentive) return;

    if (!employees) return;

    for (const employee of employees) {
      const counter = getEmployeeCounter(employee.id);

      if (
        counter >= activeIncentive.meta &&
        !activeIncentive.ganhador_ref
      ) {
        setWinner(employee.id, employee.nome);
        alert(
          '🎉 Temos um ganhador!',
          `${employee.nome} atingiu a meta do incentivo`
        );
        return;
      }
    }
  }, [
    incentiveState.employeeCounters,
    activeIncentive,
    employees,
  ]);

  const handleIncrement = (employeeId: string) => {
    if (activeIncentive?.ganhador_ref) {
      alert('Incentivo encerrado', 'Já existe um ganhador');
      return;
    }
    incrementCounter(employeeId);
  };

  const handleDecrement = (employeeId: string) => {
    if (activeIncentive?.ganhador_ref) {
      alert('Incentivo encerrado', 'Já existe um ganhador');
      return;
    }
    decrementCounter(employeeId);
  };

  const winner = ''

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
            {activeIncentive?.meta} vendas para ganhar
          </Text>
          <DinheiroDisplay value={activeIncentive.valor_incentivo} variant='positive'/>
        </View>
      </CardGradientPrimary>

      {/* Winner Banner */}
      {winner && (
        <View style={styles.winnerBanner}>
          <MaterialCommunityIcons name="crown" size={26} color="#16A34A" />
          <View>
            <Text style={styles.winnerTitle}>
              Temos um ganhador!
            </Text>
            <Text style={styles.winnerName}>
              {winner}
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={employees}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const counter = getEmployeeCounter(item.id);
          const isWinner = activeIncentive?.ganhador_ref === item.id;
          const progress = Math.min(
            (counter / activeIncentive?.meta) * 100,
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
                      size={16}
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
                  {counter} / {activeIncentive.meta} vendas
                </Text>
              </View>

              <View style={styles.counterBox}>
                <Button
                  size="tiny"
                  appearance="outline"
                  disabled={counter === 0 || !!winner}
                  onPress={() => handleDecrement(item.id)}
                >
                  <Feather name="minus" size={14} />
                </Button>

                <Text style={styles.counterValue}>
                  {counter}
                </Text>

                <Button
                  size="tiny"
                  disabled={!!winner}
                  onPress={() => handleIncrement(item.id)}
                >
                  <Feather name="plus" size={14} />
                </Button>
              </View>
            </CardGradient>
          );
        }}
      />
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
