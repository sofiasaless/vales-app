import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuFirestore, MenuFirestore } from "../firestore/menu.firestore";
import { ItemMenuPostRequestBody } from "../schema/menu.schema";

export function useCardapio(idRestaurante: string) {
  return useQuery({
    queryKey: ["cardapio"],
    queryFn: async () => {
      const menuFir = new MenuFirestore()
      const res = await menuFir.listar(idRestaurante)
      return res;
    },
    refetchInterval: 30 * 60 * 1000
  })
}

export function useAcoesCardapio() {
  const queryClient = useQueryClient();

  const atualizarProdutoMutation = useMutation({
    mutationFn: ({props}: {props: {
      idProduto: string,
      body: ItemMenuPostRequestBody
    }}) => menuFirestore.atualizar(props.idProduto, props.body),

    onSuccess: () => {
      console.info('atualizado com sucesso')
      queryClient.invalidateQueries({
        queryKey: ['cardapio'],
      });
    },

    onError: (error) => {
      console.error('Erro ao atualizar item do cardapio', error);
    },
  });

  const cadastrarProdutoMutation = useMutation({
    mutationFn: ({props}: {props: {
      idRestaurante: string,
      body: ItemMenuPostRequestBody
    }}) => menuFirestore.adicionar(props.idRestaurante, props.body),

    onSuccess: () => {
      console.info('cadastrado com sucesso')
      queryClient.invalidateQueries({
        queryKey: ['cardapio'],
      });
    },

    onError: (error) => {
      console.error('Erro ao cadastrar item do cardapio', error);
    },
  });

  return {
    atualizarProdutoMutation,
    cadastrarProdutoMutation
  }
}