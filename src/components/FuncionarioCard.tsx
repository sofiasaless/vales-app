import { Avatar, Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { customTheme } from '../theme/custom.theme';
import { Employee } from '../types';
import { CardGradient } from './CardGradient';
import { StatusBadge } from './StatusBadge';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../routes/StackRoutes';

interface FuncionarioCardProps {
  employee: Employee;
}

export const FuncionarioCard: React.FC<FuncionarioCardProps> = ({ employee }) => {
  const theme = useTheme();
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const voucherTotal = employee.currentVoucher.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  const today = new Date();
  const paidToday = employee.paymentHistory.some((payment) => {
    const paymentDate = new Date(payment.date);
    return (
      paymentDate.getDate() === today.getDate() &&
      paymentDate.getMonth() === today.getMonth() &&
      paymentDate.getFullYear() === today.getFullYear()
    );
  });

  const status = paidToday
    ? 'today'
    : voucherTotal > 0
      ? 'pending'
      : 'paid';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        pressed && { opacity: 0.85, borderWidth: 0.6, borderColor: customTheme['color-primary-300'], borderRadius: 16 },
      ]}
      onPress={() => {
        navigator.navigate('Vale')
      }}
    >
      <CardGradient styles={styles.card}>
        <View style={styles.content}>
          <Avatar
            size="large"
            style={styles.avatar}
            source={{ uri: 'https://static.vecteezy.com/ti/vetor-gratis/p1/7319933-black-avatar-person-icons-user-profile-icon-vetor.jpg' }}
          />

          <Text
            category="s1"
            numberOfLines={1}
            style={styles.name}
          >
            {employee.name}
          </Text>

          <Text
            category="c1"
            appearance="hint"
            style={styles.role}
          >
            {employee.role}
          </Text>

          <Text
            category="h6"
            status={voucherTotal > 0 ? 'danger' : 'basic'}
            style={styles.value}
          >
            R$ {voucherTotal.toFixed(2)}
          </Text>

          <StatusBadge status={status} />
        </View>
      </CardGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },

  card: {
    borderRadius: 16,
    padding: 16,
  },

  content: {
    alignItems: 'center',
  },

  avatar: {
    marginBottom: 12,
  },

  name: {
    textAlign: 'center',
    width: '100%',
  },

  role: {
    marginTop: 2,
    marginBottom: 8,
    textAlign: 'center',
  },

  value: {
    marginBottom: 8,
  },
});
