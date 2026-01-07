import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';

interface DinheiroDisplayProps {
  value: number;
  size?: 'tn' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'positive' | 'negative' | 'black';
  showSign?: boolean;
  style?: any;
}

export const DinheiroDisplay = ({
  value,
  size = 'md',
  variant = 'default',
  showSign = false,
  style,
}: DinheiroDisplayProps) => {
  const theme = useTheme();

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(value));

  const sign = value < 0 ? '- ' : showSign && value > 0 ? '+ ' : '';

  const colorMap = {
    default: theme['text-basic-color'],
    positive: theme['color-success-600'],
    negative: theme['color-danger-600'],
    black: 'black'
  };

  return (
    <Text
      style={[
        styles.base,
        styles[size],
        style,
        { color: colorMap[variant] }
      ]}
    >
      {sign}
      {formattedValue}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  tn: {
    fontSize: 12,
  },
  sm: {
    fontSize: 14,
  },
  md: {
    fontSize: 16,
  },
  lg: {
    fontSize: 22,
  },
  xl: {
    fontSize: 30,
  },
});
