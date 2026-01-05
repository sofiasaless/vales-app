import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';

interface StatusBadgeProps {
  status: 'pending' | 'paid' | 'today';
}

const statusConfig = {
  pending: {
    label: 'A receber',
  },
  paid: {
    label: 'Pago',
  },
  today: {
    label: 'Pago hoje',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const theme = useTheme();
  const config = statusConfig[status];

  const stylesByStatus = {
    pending: {
      backgroundColor: `${theme['color-warning-500']}26`, // ~15%
      borderColor: `${theme['color-warning-500']}4D`,     // ~30%
      textColor: theme['color-warning-500'],
    },
    paid: {
      backgroundColor: `${theme['color-success-500']}26`,
      borderColor: `${theme['color-success-500']}4D`,
      textColor: theme['color-success-500'],
    },
    today: {
      backgroundColor: `${theme['color-success-500']}33`, // ~20%
      borderColor: `${theme['color-success-500']}66`,     // ~40%
      textColor: theme['color-success-500'],
    },
  }[status];

  return (
    <Text
      category="c2"
      style={[
        styles.badge,
        {
          backgroundColor: stylesByStatus.backgroundColor,
          borderColor: stylesByStatus.borderColor,
          color: stylesByStatus.textColor,
        },
      ]}
    >
      {config.label}
    </Text>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    textAlign: 'center',
    overflow: 'hidden',
  },
});
