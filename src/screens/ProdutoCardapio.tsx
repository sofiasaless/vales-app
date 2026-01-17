import { NavigationProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Button, Card, Input, Layout, Text } from "@ui-kitten/components";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useAcoesCardapio } from "../hooks/useCardapio";
import { ItemMenu, ItemMenuPostRequestBody } from "../schema/menu.schema";
import { customTheme } from "../theme/custom.theme";
import { RootStackParamList } from "../routes/StackRoutes";

export const ProdutoCardapio = () => {
  const route = useRoute();
  const { idRest } = route.params as { idRest: string };
  const { produtoEditavel } = route.params as { produtoEditavel: ItemMenu | null };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [form, setForm] = useState<ItemMenuPostRequestBody>({
    descricao: '',
    preco: 0
  })

  const { atualizarProdutoMutation, cadastrarProdutoMutation } = useAcoesCardapio()

  const handleSubmit = async () => {
    if (produtoEditavel) {
      atualizarProdutoMutation.mutate({
        props: {
          idProduto: produtoEditavel.id,
          body: form
        }
      });
    } else {
      cadastrarProdutoMutation.mutate({
        props: {
          idRestaurante: idRest,
          body: form
        }
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (produtoEditavel) setForm(produtoEditavel);
    }, [produtoEditavel])
  )

  useEffect(() => {
    if (atualizarProdutoMutation.isSuccess) navigation.goBack()
    if (cadastrarProdutoMutation.isSuccess) navigation.goBack()

  }, [cadastrarProdutoMutation.isSuccess, atualizarProdutoMutation.isSuccess])

  return (
    <Layout level="1" style={styles.container}>

      <Card style={styles.card}>

        <Text style={{ marginBottom: 20 }}>Editar produto</Text>

        <Input
          size="small"
          label="Descrição"
          value={form?.descricao}
          style={{ marginBottom: 15 }}
          onChangeText={(v) => setForm((prev) => ({
            ...prev!,
            descricao: v,
          }))}
        />

        <Input
          size="small"
          label={"Preço"}
          placeholder="0,00"
          keyboardType="numeric"
          value={form?.preco.toString()}
          onChangeText={(v) => setForm((prev) => ({
            ...prev!,
            preco: Number(v)
          }))}
          status={'primary'}
          accessoryLeft={() => (
            <Text style={{ marginHorizontal: 8 }}>R$</Text>
          )}
        />
      </Card>

      <Button
        size="large"
        onPress={handleSubmit}
        disabled={atualizarProdutoMutation.isPending || cadastrarProdutoMutation.isPending}
      >
        {(produtoEditavel) ? 'Salvar alterações' : 'Cadastrar novo produto'}
      </Button>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
  },
  card: {
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: customTheme["text-disabled-color"],
    borderRadius: 16,
    backgroundColor: customTheme["background-basic-color-4"]
  }
});
