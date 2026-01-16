import { useRoute } from '@react-navigation/native';
import {
  Button,
  Divider,
  IndexPath,
  Input,
  Layout,
  Modal,
  Select,
  SelectItem,
  Spinner,
  Text,
} from '@ui-kitten/components';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import { AvatarIniciais } from '../components/AvatarIniciais';
import { CardGradient } from '../components/CardGradient';
import { useGerenteConectado, useListarGerentes } from '../hooks/useGerente';
import { Gerente, GerentePostRequestBody, GerenteUpdateRequestBody, TiposGerente } from '../schema/gerente.schema';
import { gerenteFirestore } from '../firestore/gerente.firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { converterTimestamp } from '../util/formatadores.util';

type CriarGerenteInput = {
  idRestaurante: string;
  body: GerentePostRequestBody;
};

const bodyVazio: GerentePostRequestBody = {
  nome: '',
  senha: '',
  tipo: 'AUXILIAR'
}

export default function GerenciarGerentes() {
  const route = useRoute();
  const { idRest } = route.params as { idRest: string };

  const queryClient = useQueryClient();

  const { data: gerentes, isLoading } = useListarGerentes(idRest);
  const { data: gerente_conectado } = useGerenteConectado()

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Gerente | null>(null);

  const [form, setForm] = useState<GerentePostRequestBody>(bodyVazio)

  const [tipoIndex, setTipoIndex] = useState<IndexPath>(new IndexPath(1));

  const tipoSelecionado: TiposGerente =
    tipoIndex.row === 0 ? 'GERENTE' : 'AUXILIAR';

  function resetForm() {
    setForm(bodyVazio)
    setTipoIndex(new IndexPath(1));
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setModalVisible(true);
  }

  const openEdit = (gerente: Gerente) => {
    setEditing(gerente);
    setForm({
      nome: gerente.nome,
      senha: gerente.senha,
      tipo: gerente.tipo
    })
    setTipoIndex(
      gerente.tipo === 'GERENTE' ? new IndexPath(0) : new IndexPath(1)
    );
    setModalVisible(true);
  }

  const criarGerenteMutation = useMutation({
    mutationFn: ({ idRestaurante, body }: CriarGerenteInput) =>
      gerenteFirestore.criar(idRestaurante, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gerentes'],
      });
    },

    onError: (error) => {
      console.error('Erro ao criar gerente', error);
    },
  });

  const atualizarGerenteMutation = useMutation({
    mutationFn: ({ props }: {
      props: {
        idGerente: string, body: Partial<GerenteUpdateRequestBody>,
        idRestaurante: string
      }
    }) => gerenteFirestore.atualizar(props.idRestaurante, props.idGerente, props.body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gerentes'],
      });
    },

    onError: (error) => {
      console.error('Erro ao atualizar gerente', error);
    },
  });

  const excluirGerenteMutation = useMutation({
    mutationFn: ({ props }: {
      props: {
        idGerente: string,
        idRestaurante: string
      }
    }) => gerenteFirestore.excluir(props.idRestaurante, props.idGerente),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gerentes'],
      });
    },

    onError: (error) => {
      console.error('Erro ao atualizar gerente', error);
    },
  });

  const handleSave = async () => {
    if (!form.nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    if (!editing && !form.senha) {
      Alert.alert('Erro', 'Senha é obrigatória');
      return;
    }

    form.tipo = tipoSelecionado;

    if (editing) {
      atualizarGerenteMutation.mutate({
        props: {
          body: form,
          idGerente: editing.id,
          idRestaurante: idRest
        }
      })
    } else {
      criarGerenteMutation.mutate({
        idRestaurante: idRest,
        body: form
      })
    }

    setModalVisible(false);
    resetForm();
  }


  return (
    <Layout style={styles.container}>
      <Divider />

      <Button style={styles.addButton} onPress={openCreate}>
        Cadastrar Novo Usuário
      </Button>

      {
        (isLoading) ?
          <Spinner />
          :
          <FlatList
            data={gerentes}
            keyExtractor={item => item.id}
            renderItem={(usuario) => (
              <CardGradient styles={[styles.item, !usuario.item.ativo && styles.inactive]}>
                <View style={styles.itemHeader}>
                  <AvatarIniciais name={usuario.item.nome} />

                  <View style={styles.info}>
                    <Text category="s1">{usuario.item.nome}</Text>
                    <Text appearance="hint" category="c1">
                      {usuario.item.tipo}
                    </Text>
                    <Text appearance="hint" category="c2">
                      Criado em {converterTimestamp(usuario.item.data_criacao).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <Button
                    size="small"
                    appearance="ghost"
                    onPress={() => openEdit(usuario.item)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    appearance="ghost"
                    disabled={((gerente_conectado?.id === usuario.item.id) || atualizarGerenteMutation.isPending)}
                    onPress={() => atualizarGerenteMutation.mutate({
                      props: {
                        body: { ativo: !usuario.item.ativo },
                        idGerente: usuario.item.id,
                        idRestaurante: idRest
                      }
                    })}
                  >
                    {usuario.item.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button
                    size="small"
                    appearance="ghost"
                    status="danger"
                    disabled={(gerente_conectado?.id === usuario.item.id) || excluirGerenteMutation.isPending}
                    onPress={() => excluirGerenteMutation.mutate({
                      props: {
                        idGerente: usuario.item.id,
                        idRestaurante: idRest
                      }
                    })}
                  >
                    Excluir
                  </Button>
                </View>
              </CardGradient>
            )}
            contentContainerStyle={styles.list}
            windowSize={5}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
          />
      }

      <Modal
        visible={modalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalVisible(false)}
      >
        <Layout style={styles.modal}>
          <Text category="h6" style={styles.modalTitle}>
            {editing ? 'Editar Usuário' : 'Novo Usuário'}
          </Text>

          <Input
            label="Nome"
            value={form.nome}
            onChangeText={(e) => setForm(prev => ({
              ...prev,
              nome: e
            }))}
            style={styles.input}
          />

          <Select
            label="Tipo"
            selectedIndex={tipoIndex}
            onSelect={index => setTipoIndex(index as IndexPath)}
            value={tipoSelecionado}
            style={styles.input}
          >
            <SelectItem title="Gerente" />
            <SelectItem title="Auxiliar" />
          </Select>

          <Input
            label="Senha"
            secureTextEntry
            value={form.senha}
            onChangeText={(e) => setForm(prev => ({
              ...prev,
              senha: e
            }))}
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Button appearance="ghost" onPress={() => setModalVisible(false)}>
              Cancelar
            </Button>
            <Button disabled={criarGerenteMutation.isPending} onPress={handleSave}>
              {editing ? 'Salvar' : 'Cadastrar'}
            </Button>
          </View>
        </Layout>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    alignItems: 'center',
  },

  addButton: {
    margin: 16,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10
  },

  item: {
    padding: 14,
    borderRadius: 16
  },

  inactive: {
    opacity: 0.5,
  },

  itemHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0edff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },

  modal: {
    width: 320,
    padding: 16,
    borderRadius: 12,
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
    gap: 12,
    marginTop: 8,
  },

  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
