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

  const handleDelete = () => {

  };

  useEffect(() => {
    refetch()
  }, [carregandoRest])

  const renderItem = ({ item }: { item: ItemMenu }) => (
    <Card
      style={[styles.card]}
    >
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
      <Layout style={styles.botaoAdicinonar}>
        <Button
          onPress={() => {
            resetForm()
            setModalVisible(true)
          }}
          accessoryLeft={<Entypo name="plus" size={20} color="black" />}
        >Novo produto</Button>
      </Layout>

      {(isLoading) ?
        <Spinner />
        :
        (itensCardapio) ?
          itensCardapio.length > 0 ? (
            <FlatList
              data={itensCardapio}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={renderItem}
              removeClippedSubviews
              windowSize={5}
              maxToRenderPerBatch={10}
              initialNumToRender={10}
            />
          ) : (
            <View style={styles.empty}>
              <Text appearance="hint" style={styles.emptyText}>
                Nenhum produto cadastrado
              </Text>
              <Button onPress={openAdd} style={styles.emptyButton}>
                {/* <Ionicons name="add" size={18} /> */}
                <Text>Adicionar Produto</Text>
              </Button>
            </View>
          )
          :
          <View style={styles.empty}>
            <Text appearance="hint" style={styles.emptyText}>
              Nenhum produto cadastrado
            </Text>
            <Button onPress={openAdd} style={styles.emptyButton}>
              {/* <Ionicons name="add" size={18} /> */}
              <Text>Adicionar Produto</Text>
            </Button>
          </View>
      }

      <Modal
        visible={modalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalVisible(false)}
      >
        <Card disabled style={{ padding: 10, width: '130%', alignSelf: 'center' }}>
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
