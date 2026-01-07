import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Button, Input, Layout, Text, useTheme } from '@ui-kitten/components';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { ItemCardapio } from '../components/ItemCardapio';
import { mockEmployees, mockMenuProducts } from '../mocks/mockData';
import { RootStackParamList } from '../routes/StackRoutes';
import { VoucherItem } from '../types';
import { customTheme } from '../theme/custom.theme';

interface SelectedItem {
  productId: string;
  quantity: number;
}


export default function Cardapio() {
  // const { employeeId } = route.params;
  const theme = useTheme();
  const styles = createStyles(theme);

  const employee = mockEmployees[0];
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  // if (!employee) {
  //   navigation.goBack();
  //   return null;
  // }

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const toggleItem = (productId: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.productId === productId);
      if (exists) {
        return prev.filter((i) => i.productId !== productId);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const isSelected = (productId: string) =>
    selectedItems.some((i) => i.productId === productId);

  const getQuantity = (productId: string) =>
    selectedItems.find((i) => i.productId === productId)?.quantity || 1;

  const totalItems = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalValue = selectedItems.reduce((sum, item) => {
    const product = mockMenuProducts.find(
      (p) => p.id === item.productId
    );
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const handleAddToVoucher = () => {
    if (!selectedItems.length) return;

    const voucherItems: VoucherItem[] = selectedItems.map(
      (selected) => {
        const product = mockMenuProducts.find(
          (p) => p.id === selected.productId
        )!;
        return {
          id: `vi-${Date.now()}-${selected.productId}`,
          productId: selected.productId,
          name: product.name,
          unitPrice: product.price,
          quantity: selected.quantity,
          addedAt: new Date(),
        };
      }
    );

    // dispatch({
    //   type: 'ADD_VOUCHER_ITEMS',
    //   payload: {
    //     employeeId: employee.id,
    //     items: voucherItems,
    //   },
    // });

    // navigation.navigate('EmployeeDetails', {
    //   employeeId: employee.id,
    // });
  };


  return (
    <Layout style={styles.container}>
      <Layout style={styles.barraPesquisa}>
        <Input
          size="large"
          status='primary'
          // label="Nome Completo *"
          placeholder="Pesquisar por produto...."
          accessoryLeft={<Feather name="search" size={22} color={customTheme['color-primary-500']} />}
        // value={formData.name}
        // onChangeText={(v) => handleChange('name', v)}
        // status={errors.name ? 'danger' : 'basic'}
        // caption={errors.name}
        />
      </Layout>
      <ScrollView contentContainerStyle={styles.content}>

        {mockMenuProducts.concat(mockMenuProducts).map((product, index) => (
          <ItemCardapio
            key={index}
            product={product}
            selected={isSelected(product.id)}
            quantity={getQuantity(product.id)}
            onToggle={() => toggleItem(product.id)}
            onQuantityChange={(qty) =>
              updateQuantity(product.id, qty)
            }
          />
        ))}

        {mockMenuProducts.length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="cube-outline"
              size={48}
              color={theme['color-basic-500']}
            />
            <Text appearance="hint">
              Nenhum produto no cardápio
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      {selectedItems.length > 0 && (
        <View style={styles.bottomBar}>
          <Button
            size="giant"
            style={styles.actionButton}
            onPress={handleAddToVoucher}
          >
            <Ionicons
              name="cart-outline"
              size={20}
              color="black"
            />
            <Text style={styles.actionText}>
              {' '}
              Adicionar ({totalItems})
            </Text>
            <Text style={styles.dot}> • </Text>
            <DinheiroDisplay
              value={totalValue}
              size="md"
              variant="black"
            />
          </Button>
        </View>
      )}
    </Layout>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    barraPesquisa: {
      paddingHorizontal: 16,
      paddingBlock: 10
    },
    content: {
      padding: 16,
      paddingBottom: 120,
      gap: 10,
    },
    category: {
      gap: 8,
    },
    categoryTitle: {
      fontWeight: '600',
      letterSpacing: 1,
    },
    empty: {
      alignItems: 'center',
      gap: 8,
      marginTop: 40,
    },
    bottomBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 16,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    actionButton: {
      borderRadius: 16,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    actionText: {
      color: 'black',
      fontWeight: '600',
    },
    dot: {
      color: 'black',
      opacity: 0.8,
    },
  }
  );
