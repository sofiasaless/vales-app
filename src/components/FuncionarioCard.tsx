import { Avatar, Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../routes/StackRoutes';
import { Funcionario } from '../schema/funcionario.schema';
import { customTheme } from '../theme/custom.theme';
import { CardGradient } from './CardGradient';
import { StatusBadge } from './StatusBadge';
import { AvatarIniciais } from './AvatarIniciais';

interface FuncionarioCardProps {
  employee: Funcionario;
}

export const FuncionarioCard: React.FC<FuncionarioCardProps> = ({ employee }) => {
  const theme = useTheme();
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const voucherTotal = () => {
    if (employee.vales?.length === 0) return 0;
    return employee.vales?.reduce(
      (total, item) => total + item.preco_unit * item.quantidade,
      0
    );
  }


  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        pressed && { opacity: 0.85, borderWidth: 0.6, borderColor: customTheme['color-primary-300'], borderRadius: 16 },
      ]}
      onPress={() => {
        navigator.navigate('Vale', { idFunc: employee.id })
      }}
    >
      <CardGradient styles={styles.card}>
        <View style={styles.content}>
          <AvatarIniciais img_url={employee.foto_url} name={employee.nome} />

          <Text
            category="s1"
            numberOfLines={1}
            style={styles.name}
          >{employee.nome}</Text>

          <Text
            category="s2"
            appearance="hint"
            style={styles.role}
          >{employee.cargo}</Text>

          <Text
            category="h6"
            status={voucherTotal() > 0 ? 'danger' : 'basic'}
            style={styles.value}
          >
            R$ {voucherTotal().toFixed(2)}
          </Text>

          {/* <StatusBadge status={status} /> */}
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
    marginTop: 10
  },

  role: {
    marginTop: 2,
    marginBottom: 8,
    textAlign: 'center',
  },

  value: {
    textAlign: 'center',
    marginBottom: 8,
  },
});
