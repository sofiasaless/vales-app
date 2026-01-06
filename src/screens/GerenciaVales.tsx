import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Avatar,
  Button,
  Card,
  Input,
  Layout,
  Text,
} from '@ui-kitten/components';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AntDesign from '@expo/vector-icons/AntDesign';
import { mockEmployees } from '../mocks/mockData';
import { customTheme } from '../theme/custom.theme';
import { ItemVale } from '../components/ItemVale';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../routes/StackRoutes';

export const GerenciaVales = () => {
  // const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const { id } = route.params as RouteParams;

  // const { getEmployee, getVoucherTotal, dispatch } = useEmployees();

  const employee = mockEmployees[0];

  const [cashValue, setCashValue] = useState('');
  const [cashDescription, setCashDescription] = useState('');
  const [cashError, setCashError] = useState('');

  if (!employee) {
    return (
      <Layout style={styles.centered}>
        {/* <Icon name="alert-circle-outline" width={48} height={48} fill="#FF3D71" /> */}
        <Text category="h6" style={styles.notFoundText}>
          Funcionário não encontrado
        </Text>
        <Button style={styles.backButton}>
          Voltar
        </Button>
      </Layout>
    );
  }

  const voucherTotal = 382;

  const handleRemoveItem = (itemId: string) => {
    // dispatch({
    //   type: 'REMOVE_VOUCHER_ITEM',
    //   payload: { employeeId: employee.id, itemId },
    // });
  };

  const handleAddCashVoucher = () => {
    const value = Number(
      cashValue.replace(/[^\d,]/g, '').replace(',', '.')
    );

    if (!value || value <= 0) {
      setCashError('Informe um valor válido');
      return;
    }

    // dispatch({
    //   type: 'ADD_VOUCHER_ITEM',
    //   payload: {
    //     employeeId: employee.id,
    //     item: {
    //       id: `cash-${Date.now()}`,
    //       name: 'Vale em dinheiro',
    //       description: cashDescription || 'Vale em dinheiro',
    //       unitPrice: value,
    //       quantity: 1,
    //     },
    //   },
    // });

    setCashValue('');
    setCashDescription('');
    setCashError('');
  };

  const vales = employee.currentVoucher.concat(employee.currentVoucher)

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Layout level='1' style={styles.card}>
          <View style={styles.employeeHeader}>
            <Avatar size='giant' source={{ uri: 'https://static.vecteezy.com/ti/vetor-gratis/p1/7319933-black-avatar-person-icons-user-profile-icon-vetor.jpg' }} />
            <View style={styles.employeeInfo}>
              <Text category="h6">{employee.name}</Text>
              <Text appearance="hint">{employee.role}</Text>
              <Text appearance="hint" category="c1">
                {employee.type === 'DIARISTA'
                  ? 'Diarista'
                  : 'Fixo (Quinzenas)'}
              </Text>
            </View>
          </View>
        </Layout>

        <Layout level='1' style={styles.card}>
          <Text category="s2" style={styles.sectionTitle}>
            Adicionar vale em Dinheiro
          </Text>

          <Input
            label="Valor (R$)"
            size='small'
            placeholder="0,00"
            value={cashValue}
            keyboardType="decimal-pad"
            onChangeText={(text) => {
              setCashValue(text.replace(/[^\d,]/g, ''));
              setCashError('');
            }}
            status={cashError ? 'danger' : 'basic'}
          />

          <Input
            label="Descrição"
            size='small'
            placeholder="Ex: Adiantamento"
            value={cashDescription}
            onChangeText={setCashDescription}
            style={styles.input}
          />

          {cashError && (
            <Text status="danger" category="c1" style={styles.errorText}>
              {cashError}
            </Text>
          )}

          <Button
            style={styles.addButton}
            size='small'
            onPress={handleAddCashVoucher}
          // accessoryLeft={(props) => (
          //   <Icon {...props} name="plus-outline" />
          // )}
          >
            Adicionar Vale
          </Button>
        </Layout>

        {/* Vale Atual Header */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <Feather name="shopping-bag" size={18} color={customTheme['color-primary-400']} />
            <Text category="h6">Vale Atual</Text>
          </View>
          <Button
            size="small"
            accessoryLeft={<AntDesign name="plus" size={15} color="black" />}
          >
            Itens
          </Button>
        </View>

        {/* Lista de Itens */}
        {vales.length > 0 ? (
          vales.map((item) => (
            <ItemVale key={item.id} item={item} showControls/>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            {/* <Icon
              name="shopping-bag-outline"
              width={32}
              height={32}
              fill="#8F9BB3"
            /> */}
            <Text appearance="hint" style={styles.emptyText}>
              Nenhum item no vale
            </Text>
          </Card>
        )}

        <Layout level='1' style={styles.card}>
          <View style={styles.totalRow}>
            <Text category="s1">Total do Vale</Text>
            <Text category="s1">R$ 430,30</Text>
          </View>
        </Layout>

        <Button
          size="medium"
          // disabled={voucherTotal === 0}
          onPress={() =>
            navigation.navigate('ResumoPagamento')
          }
          accessoryLeft={<Entypo name="credit-card" size={20} color="black" />}
        >
          Pagar Funcionário
        </Button>

        <View style={styles.actionRow}>
          <Button
            appearance="outline"
            status='basic'
            size='small'
            style={styles.actionButton}
            accessoryLeft={<Feather name="user" size={15} color={customTheme['text-basic-color']} />}
          // onPress={() =>
          //   navigation.navigate('EmployeeDetails', {
          //     employeeId: employee.id,
          //   })
          // }
          >
            Detalhes
          </Button>

          <Button
            size='small'
            status='basic'
            appearance="outline"
            style={styles.actionButton}
            accessoryLeft={<MaterialCommunityIcons name="history" size={16} color={customTheme['text-basic-color']} />}
          // onPress={() =>
          //   navigation.navigate('EmployeeHistory', {
          //     employeeId: employee.id,
          //   })
          // }
          >
            Histórico
          </Button>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    marginTop: 12,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 8,
  },
  card: {
    padding: 18,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: customTheme['text-disabled-color'],
    backgroundColor: customTheme['color-basic-700'] 
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  input: {
    marginTop: 8,
  },
  errorText: {
    marginTop: 4,
  },
  addButton: {
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});