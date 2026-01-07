import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  Card,
  Input,
  Layout,
  Modal,
  Text,
  Toggle,
  useTheme,
} from '@ui-kitten/components';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View
} from 'react-native';

import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { mockMenuProducts } from '../mocks/mockData';
import { customTheme } from '../theme/custom.theme';
import { MenuProduct } from '../types';
import { parseCurrencyInput } from '../util/formatadores.util';

export const GerenciaCardapio = () => {
  const styles = createStyles();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<MenuProduct | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    available: true,
  });

  const resetForm = () => {
    setFormData({ name: '', price: '', available: true });
    setEditingProduct(null);
  };

  const openAdd = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (product: MenuProduct) => {
    setFormData({
      name: product.name,
      price: product.price.toString().replace('.', ','),
      available: product.available,
    });
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.price) {
      // toast.error('Preencha todos os campos');
      return;
    }

    const price = parseCurrencyInput(formData.price);
    if (price <= 0) {
      // toast.error('Preço inválido');
      return;
    }

    if (editingProduct) {
      // dispatch({
      //   type: 'UPDATE_MENU_PRODUCT',
      //   payload: {
      //     ...editingProduct,
      //     name: formData.name.trim(),
      //     price,
      //     available: formData.available,
      //   },
      // });
      // toast.success('Produto atualizado');
    } else {
      // dispatch({
      //   type: 'ADD_MENU_PRODUCT',
      //   payload: {
      //     id: `prod-${Date.now()}`,
      //     name: formData.name.trim(),
      //     price,
      //     available: formData.available,
      //     category: 'Geral',
      //   },
      // });
      // toast.success('Produto adicionado');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteProduct) return;

    // dispatch({
    //   type: 'DELETE_MENU_PRODUCT',
    //   payload: deleteProduct.id,
    // });

    // toast.success('Produto removido');
    setDeleteProduct(null);
  };

  const renderItem = ({ item }: { item: MenuProduct }) => (
    <Card
      style={[styles.card, !item.available && styles.disabled]}
    >
      <View style={styles.cardRow}>
        <View style={styles.cardInfo}>
          <Text category="s1">{item.name}</Text>
          <DinheiroDisplay value={item.price} size="tn" />
          {!item.available && (
            <Text status="warning" category="c1">
              Indisponível
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            size="small"
            appearance="ghost"
            onPress={() => openEdit(item)}
          >
            <MaterialCommunityIcons name="pencil" />
          </Button>

          <Button
            size="small"
            appearance="ghost"
            status="danger"
            onPress={() => setDeleteProduct(item)}
          >
            <MaterialCommunityIcons name="trash-can" size={24} />
          </Button>
        </View>
      </View>
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <Layout style={styles.botaoAdicinonar}>
        <Button
          onPress={() => {
            resetForm()
            setModalVisible(true)
          }}
          accessoryLeft={<Entypo name="plus" size={20} color="black" />}
        >Novo produto</Button>
      </Layout>

      {mockMenuProducts.length > 0 ? (
        <FlatList
          data={mockMenuProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.empty}>
          {/* <Ionicons
            name="cube-outline"
            size={48}
            color={theme['color-basic-500']}
          /> */}
          <Text appearance="hint" style={styles.emptyText}>
            Nenhum produto cadastrado
          </Text>
          <Button onPress={openAdd} style={styles.emptyButton}>
            {/* <Ionicons name="add" size={18} /> */}
            <Text>Adicionar Produto</Text>
          </Button>
        </View>
      )}

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalVisible(false)}
      >
        <Card disabled style={{padding: 10, width: '130%', alignSelf: 'center'}}>
          <Text category="h6" style={styles.modalTitle}>
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </Text>

          <Input
            label="Nome do Produto"
            value={formData.name}
            onChangeText={(name) =>
              setFormData({ ...formData, name })
            }
            style={styles.input}
          />

          <Input
            label="Preço"
            value={formData.price}
            keyboardType="decimal-pad"
            placeholder="0,00"
            onChangeText={(price) =>
              setFormData({
                ...formData,
                price: price.replace(/[^\d,]/g, ''),
              })
            }
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Button
              size='small'
              appearance="outline"
              onPress={() => setModalVisible(false)}
            >
              Cancelar
            </Button>
            <Button onPress={handleSave} size='small'>
              {editingProduct ? 'Salvar' : 'Adicionar'}
            </Button>
          </View>
        </Card>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        visible={!!deleteProduct}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setDeleteProduct(null)}
      >
        <Card disabled>
          <Text category="h6">Remover Produto</Text>
          <Text appearance="hint" style={styles.deleteText}>
            Tem certeza que deseja remover este produto?
          </Text>

          <View style={styles.modalActions}>
            <Button size='small' appearance="outline" onPress={() => setDeleteProduct(null)}>
              Cancelar
            </Button>
            <Button size='small' status="danger" onPress={handleDelete}>
              Remover
            </Button>
          </View>
        </Card>
      </Modal>
    </Layout>
  );
};

const createStyles = () =>
  StyleSheet.create({
    botaoAdicinonar: {
      paddingHorizontal: 16,
      paddingBlock: 10
    },
    container: {
      flex: 1,
    },

    list: {
      padding: 16,
      gap: 12,
    },

    card: {
      borderRadius: 16,
      backgroundColor: customTheme['color-basic-800'],
      borderColor: customTheme['color-basic-600'],
    },

    disabled: {
      opacity: 0.5,
    },

    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    cardInfo: {
      flex: 1,
      gap: 4,
    },

    actions: {
      flexDirection: 'row',
    },

    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },

    emptyText: {
      marginVertical: 12,
    },

    emptyButton: {
      marginTop: 8,
    },

    newText: {
      marginLeft: 4,
    },

    backdrop: {
      backgroundColor: 'rgba(0,0,0,0.5)'
    },

    modalTitle: {
      marginBottom: 12,
    },

    input: {
      marginBottom: 12,
    },

    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },

    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 16,
    },

    deleteText: {
      marginVertical: 12,
    },
  }
  );
