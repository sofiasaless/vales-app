import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Button, useTheme } from '@ui-kitten/components';
import Feather from '@expo/vector-icons/Feather';

import { VoucherItem } from '../types';
import { customTheme } from '../theme/custom.theme';

interface VoucherItemCardProps {
  item: VoucherItem;
  showControls?: boolean;
}

export const ItemVale: React.FC<VoucherItemCardProps> = ({
  item
}) => {
  const theme = useTheme();
  const totalValue = item.unitPrice * item.quantity;

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: `${theme['color-basic-600']}80`, // secondary/50
        },
      ]}
      disabled
    >
      <View style={styles.content}>
        {/* Info */}
        <View style={styles.info}>
          <Text category="s2" numberOfLines={1}>
            {item.name}
          </Text>

          <Text appearance="hint" category="c2">
            {item.quantity}x{' '}
            <Text category='s2'>{totalValue}</Text>
          </Text>
        </View>

        {/* Right side */}
        <View style={styles.right}>
          <Text category='s2'>R$ {totalValue}</Text>

            <TouchableOpacity style={styles.removeButton}>
              <Feather name="trash" size={15} color={customTheme['color-danger-600']} />
            </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  total: {
    marginRight: 8,
  },
  removeButton: {
    borderRadius: 999,
    padding: 7,
    backgroundColor: '#ef6a5b3d'
  },
});