import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  Card,
  Input,
  Layout,
  Modal,
  Spinner,
  Text
} from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  View
} from 'react-native';

import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { menuFirestore, MenuFirestore } from '../firestore/menu.firestore';
import { useCardapio } from '../hooks/useCardapio';
import { useRestauranteConectado } from '../hooks/useRestaurante';
import { ItemMenu, ItemMenuPostRequestBody } from '../schema/menu.schema';
import { customTheme } from '../theme/custom.theme';
import { AppModal } from '../components/AppModal';

export const GerenciaCardapio = () => {
  const styles = createStyles();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ItemMenu | null>(null);

  const { data: res, isLoading: carregandoRest } = useRestauranteConectado()

  const {
    data: itensCardapio,
    isLoading,
    refetch
  } = useCardapio(res?.id || '')

  const [formData, setFormData] = useState<ItemMenuPostRequestBody>({
    descricao: '',
    preco: 0,
    restaurante_ref: '',
  });

  const resetForm = () => {
    setFormData({ descricao: '', preco: 0, restaurante_ref: '' });
    setEditingProduct(null);
  };

  const openAdd = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (product: ItemMenu) => {
    setFormData({
      descricao: product.descricao,
      preco: product.preco,
      restaurante_ref: ''
    });
    setEditingProduct(product);
    setModalVisible(true);
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateNovoProduto = () => {
    const newErrors: Record<string, string> = {};

    if (formData.descricao === '') newErrors.descricao = 'Nome do produto é obrigatório';

    if (formData.preco <= 0) newErrors.preco = 'Preço precisa ser maior que zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAtualizacaoProduto = () => {
    const newErrors: Record<string, string> = {};

    if (editingProduct?.descricao === '') newErrors.descricao = 'Nome do produto é obrigatório';

    if (editingProduct?.preco === undefined || editingProduct?.preco <= 0) newErrors.preco = 'Preço precisa ser maior que zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {

    if (editingProduct) {
      if (!validateAtualizacaoProduto()) return;
      await menuFirestore.atualizar(editingProduct.id, editingProduct);
      refetch()
      setModalVisible(false);
      resetForm();
    } else {
      if (!validateNovoProduto()) return;
      if (res?.id) {
        formData.restaurante_ref = res?.id
        await menuFirestore.adicionar(formData)
        refetch()
        setModalVisible(false);
        resetForm();
      }
    }

  };

  useEffect(() => {
    refetch()
  }, [carregandoRest])

  const renderItem = ({ item }: { item: ItemMenu }) => (
    <Card style={[styles.card]}>
      <View style={styles.cardRow}>
        <View style={styles.cardInfo}>
          <Text category="s1">{item.descricao}</Text>
          <DinheiroDisplay value={item.preco} size="tn" />
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
            onPress={() => {
              Alert.alert('Remover produto', 'Tem certeza que quer remover o produto?', [
                {
                  text: 'Cancelar',
                  style: 'cancel'
                },
                {
                  text: 'Confirmar exclusão',
                  style: 'destructive',
                  onPress: async () => {
                    const menuFir = new MenuFirestore()
                    await menuFir.remover(item.id);
                    refetch()
                  }
                }
              ])
            }}
          >
            <MaterialCommunityIcons name="trash-can" size={24} />
          </Button>
        </View>
      </View>
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <Button
          onPress={() => {
            resetForm()
            setModalVisible(true)
          }}
          accessoryLeft={<Entypo name="plus" size={20} color="black" />}
        >
          Novo produto
        </Button>
      </Layout>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <Spinner />
        </View>
      ) : itensCardapio && itensCardapio.length > 0 ? (
        <FlatList
          data={itensCardapio}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          renderItem={renderItem}
          removeClippedSubviews
          windowSize={5}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text appearance="hint" style={styles.emptyText}>
                Nenhum produto cadastrado
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.centerContainer}>
          <View style={styles.empty}>
            <Text appearance="hint" style={styles.emptyText}>
              Nenhum produto cadastrado
            </Text>
            <Button onPress={openAdd} style={styles.emptyButton}>
              <Text>Adicionar Produto</Text>
            </Button>
          </View>
        </View>
      )}

      <AppModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text category="h6" style={styles.modalTitle}>
          {editingProduct ? 'Editar Produto' : 'Novo Produto'}
        </Text>

        <Input
          label="Nome do Produto"
          value={formData.descricao}
          onChangeText={(name) =>
            setFormData({ ...formData, descricao: name })
          }
          status={errors.descricao ? 'danger' : 'basic'}
          caption={errors.descricao}
          style={styles.input}
        />

        <Input
          label="Preço"
          value={formData.preco.toString()}
          keyboardType="decimal-pad"
          placeholder="0,00"
          onChangeText={(price) =>
            setFormData({
              ...formData,
              preco: Number(price),
            })
          }
          status={errors.preco ? 'danger' : 'basic'}
          caption={errors.preco}
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
      </AppModal>
    </Layout>
  );
};


const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    list: {
      flex: 1,
      width: '100%',
    },
    listContent: {
      padding: 16,
      gap: 12,
      flexGrow: 1,
    },
    card: {
      borderRadius: 16,
      backgroundColor: customTheme['color-basic-800'],
      borderColor: customTheme['color-basic-600'],
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
    modalTitle: {
      marginBottom: 12,
    },
    input: {
      marginBottom: 12,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 16,
    },
  }
);