import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useIncentive } from '../context/InvenctiveContext';
import { RootStackParamList } from '../routes/StackRoutes';
import { customTheme } from '../theme/custom.theme';
import { CardGradientPrimary } from './CardGradientPrimary';
import { DinheiroDisplay } from './DinheiroDisplay';

export const IncentivoAtivoCard: React.FC = () => {
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();
  const { getActiveIncentive, getEmployeeCounter } = useIncentive();

  const activeIncentive = getActiveIncentive();

  if (!activeIncentive) return null;

  const winner = ''

  return (
    <CardGradientPrimary styles={styles.card}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <MaterialCommunityIcons name="star-shooting" size={18} color={customTheme['color-primary-500']} />
          <Text category="s2" status='primary'>
            Incentivo
          </Text>
        </View>

        <DinheiroDisplay value={activeIncentive.valor_incentivo} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {activeIncentive.descricao}
        </Text>

        <View style={styles.metaItem}>
          <Feather name="target" size={14} color="#9CA3AF" />
          <Text appearance="hint" style={styles.metaText}>
            Meta: {activeIncentive.meta}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <View style={styles.expiracaoBadge}>
          <Text category='c2' status='warning'>Expira em 2 dias</Text>
        </View>

        {(winner) ?
          <View style={styles.winnerBadge}>
            <MaterialCommunityIcons name="crown" size={14} color="#16A34A" />
            <Text category='c2' status='success'>Ganhador: {winner}</Text>
          </View>
          :
          <Button size='small' appearance='outline'
            accessoryLeft={<MaterialCommunityIcons name="cart" size={14} color={customTheme['color-primary-500']} />}
            onPress={() => navigator.navigate('RegistroVendaIncentivo')}
          >Registrar Venda</Button>
        }
      </View>

    </CardGradientPrimary>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  description: {
    fontWeight: '500',
    color: '#E5E7EB',
  },

  metaRow: {
    gap: 5,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    fontSize: 12,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(22,163,74,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(22,163,74,0.3)',
  },

  expiracaoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f5a52328',
    borderWidth: 1,
    borderColor: '#d488067c',
  },

  leaderBox: {
    alignItems: 'flex-end',
  },

  leaderHint: {
    fontSize: 11,
  },

  leaderText: {
    fontWeight: '600',
  },

});
