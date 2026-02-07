import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {
  Button,
  Input,
  Layout,
  Spinner,
  Text
} from '@ui-kitten/components';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CardGradient } from '../components/CardGradient';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { useTotalDespesasContext } from '../context/TotalDespesasContext';
import { categoriaFinancas } from '../firestore/categoriaFinanca.firestore';
import { useListarCategorias } from '../hooks/useCategoriaFinancas';
import { colorMap, iconMap } from '../maps/financas.map';
import { RootStackParamList } from '../routes/StackRoutes';
import { CategoriaPostRequestBodyFinancas } from '../schema/financa.schema';
import { customTheme } from '../theme/custom.theme';
import { alert } from '../util/alertfeedback.util';

export default function Financas() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { idRest } = route.params as { idRest: string };

  const { data: categorias, refetch, isLoading } = useListarCategorias(idRest)

  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoriaPostRequestBodyFinancas>({
    descricao: '',
    icone: 'shopping-cart' as keyof typeof iconMap,
    cor: 'blue' as keyof typeof colorMap
  });

  const { totalDespesas, resetarDatas, isLoading: carregandoTotal } = useTotalDespesasContext()


  const totalGeral = useMemo(() => {
    return totalDespesas?.reduce((acumulador, despesa) => {
      return acumulador + despesa.valor
    }, 0)
  }, [totalDespesas]);

  const [isAdicionando, setIsAdicionando] = useState(false)
  const addCategory = async () => {
    try {
      setIsAdicionando(true)
      if (!newCategory.descricao.trim()) return;

      await categoriaFinancas.criar(idRest, newCategory);
      refetch()
      setModalOpen(false)
    } catch (error: any) {
      alert('Ocorreu um erro ao cadastrar nova categoria', error);
    } finally {
      setIsAdicionando(false)
    }
  };

  useFocusEffect(
    useCallback(() => {
      resetarDatas()
    }, [])
  )

  return (
    <Layout style={styles.container}>
      <CardGradient styles={styles.totalCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ gap: 5 }}>
            <Text appearance="hint">Total do mês</Text>
            {(carregandoTotal) ?
              <Spinner status='danger' />
              :
              <DinheiroDisplay
                size="lg"
                variant="negative"
                value={totalGeral || 0}
              />
            }
          </View>

          <View>
            <Button size='small' status='info'
              accessoryLeft={<Ionicons name="document-attach-sharp" size={16} color="black" />}
              onPress={() => navigation.navigate('FinancasRelatorio', { idRest })}
            >Relatório</Button>
          </View>
        </View>
      </CardGradient>

      {
        (isLoading) ?
          <Spinner />
          :
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('FinancasDetalhes', { categoriaObj: item })}>
                <CardGradient styles={styles.categoryCard}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: colorMap[item.cor] },
                    ]}
                  >
                    <Feather
                      name={iconMap[item.icone as keyof typeof iconMap]}
                      size={20}
                      color="#FFF"
                    />
                  </View>

                  <View style={styles.categoryInfo}>
                    <Text category="h6">{item.descricao}</Text>
                  </View>

                  <Feather name="chevron-right" size={20} color={'white'} />
                </CardGradient>
              </TouchableOpacity>
            )}
          />
      }

      <Button
        appearance="outline"
        style={styles.addButton}
        onPress={() => setModalOpen(true)}
        accessoryLeft={<Feather name="plus" size={18} color={customTheme['color-primary-500']} />}
      >
        Registrar Categoria
      </Button>

      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <CardGradient colors_one='4' colors_two='2' styles={styles.modalContent}>
            <Text category="h6">Nova Categoria</Text>

            <Input
              label="Nome"
              status='primary'
              placeholder="Ex: Mercado"
              value={newCategory.descricao}
              onChangeText={(text) =>
                setNewCategory({ ...newCategory, descricao: text })
              }
              style={styles.input}
            />

            <Text appearance="hint">Ícone</Text>
            <View style={styles.optionsRow}>
              {Object.entries(iconMap).map(([key, icon]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() =>
                    setNewCategory({ ...newCategory, icone: key as any })
                  }
                  style={[
                    styles.optionButton,
                    newCategory.icone === key && styles.optionSelected,
                  ]}
                >
                  <Feather name={icon} size={18} color={'white'} />
                </TouchableOpacity>
              ))}
            </View>

            <Text appearance="hint">Cor</Text>
            <View style={styles.optionsRow}>
              {Object.entries(colorMap).map(([key, color]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() =>
                    setNewCategory({ ...newCategory, cor: key as any })
                  }
                  style={[
                    styles.colorDot,
                    { backgroundColor: color },
                    newCategory.cor === key && styles.colorSelected,
                  ]}
                />
              ))}
            </View>

            <Button onPress={addCategory} disabled={isAdicionando} style={styles.modalButton}>
              {(isAdicionando) ? 'Adicionando...' : 'Adicionar Categoria'}
            </Button>

            <Button
              status='danger'
              appearance="ghost"
              onPress={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
          </CardGradient>
        </View>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  totalCard: {
    padding: 16,
    gap: 5,
    borderRadius: 16,
    backgroundColor: '#1F2933',
    marginBottom: 16,
    borderWidth: 0.8,
    borderColor: customTheme['text-disabled-color']
  },

  addButton: {
    marginBottom: 16,
  },

  list: {
    gap: 12,
    paddingBottom: 120,
  },

  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },

  iconBox: {
    padding: 12,
    borderRadius: 12,
  },

  categoryInfo: {
    flex: 1,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
  },

  input: {
    marginVertical: 8,
  },

  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },

  optionButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1E293B',
  },

  optionSelected: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },

  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  colorSelected: {
    borderWidth: 2,
    borderColor: '#FFF',
  },

  modalButton: {
    marginTop: 8,
  },

  grupoBotoes: {
    alignItems: 'center',
    gap: 10
  },
});