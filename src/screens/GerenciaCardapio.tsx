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
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  View
} from 'react-native';

import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { menuFirestore, MenuFirestore } from '../firestore/menu.firestore';
import { useAcoesCardapio, useCardapio } from '../hooks/useCardapio';
import { useRestauranteConectado } from '../hooks/useRestaurante';
import { ItemMenu, ItemMenuPostRequestBody } from '../schema/menu.schema';
import { customTheme } from '../theme/custom.theme';
import { AppModal } from '../components/AppModal';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../routes/StackRoutes';
import { parseMoedaBR } from '../util/formatadores.util';

export const GerenciaCardapio = () => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ItemMenu | null>(null);

  const { data: res, isLoading: carregandoRest } = useRestauranteConectado()

  const [precoTexto, setPrecoTexto] = useState('');

  const {
    data: itensCardapio,
    isLoading,
    refetch
  } = useCardapio(res?.id || '')

  const [formData, setFormData] = useState<ItemMenuPostRequestBody>({
    descricao: '',
    preco: 0,
  });

  const resetForm = () => {
    setFormData({ descricao: '', preco: 0 });
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
    });
    setPrecoTexto(product.preco.toFixed(2))
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

    if (precoTexto === '') newErrors.preco = 'Preço precisa ser maior que zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { atualizarProdutoMutation, cadastrarProdutoMutation } = useAcoesCardapio()

  const handleSave = async () => {

    if (editingProduct) {
      if (!validateAtualizacaoProduto()) return;
      atualizarProdutoMutation.mutate({
        props: {
          body: {
            descricao: formData.descricao,
            preco: formData.preco
          },
          idProduto: editingProduct.id
        }
      })
      setModalVisible(false);
      resetForm();
    } else {
      if (!validateNovoProduto()) return;
      if (res?.id) {
        cadastrarProdutoMutation.mutate({
          props: {
            body: formData,
            idRestaurante: res.id
          }
        })
        setModalVisible(false);
        resetForm();
      }
    }

  };

  useEffect(() => {
    refetch()
  }, [carregandoRest])

  useEffect(() => {
    if (cadastrarProdutoMutation.isSuccess || atualizarProdutoMutation.isSuccess) refetch() 
  }, [cadastrarProdutoMutation.isPending, atualizarProdutoMutation.isPaused])

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
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          nestedScrollEnabled
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

      <Modal backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}} visible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <Card style={styles.cardModal}>
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
            keyboardType="decimal-pad"
            placeholder="0,00"
            value={precoTexto}
            onChangeText={(price) => {
              setPrecoTexto(price);
              const numero = parseMoedaBR(price);

              if (numero !== null) {
                setFormData({
                  ...formData,
                  preco: numero,
                })
              }
            }}
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
        </Card>
      </Modal>
    </Layout>
  );
};


const createStyles = () =>
  StyleSheet.create({
    container: {
      height: (Platform.OS === 'web') ? '80%' : '100%'
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      justifyContent: 'center'
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
    cardModal: {
      width: 300, maxWidth: 300, minWidth: 200,
    },
  }
  );