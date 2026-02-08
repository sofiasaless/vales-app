import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gerenteFirestore } from "../firestore/gerente.firestore";
import { Gerente } from "../schema/gerente.schema";
import { Platform } from "react-native";

export function useGerenteConectado() {
  return useQuery({
    queryKey: ["gerente_conectado"],
    queryFn: async () => {
      let string_res
      if (Platform.OS === 'web') {
        string_res = localStorage.getItem('gerente')
      } else {
        string_res = await AsyncStorage.getItem('gerente')
      }

      if (string_res) {
        const res = JSON.parse(string_res) as Gerente
        return res
      }
      return null
    },
    refetchOnReconnect: true,
    refetchInterval: 30 * 60 * 1000
  })
}

export function useListarGerentes(idRestaurante: string) {
  return useQuery({
    queryKey: ["gerentes"],
    queryFn: async () => {
      const res = await gerenteFirestore.listar(idRestaurante);
      return res
    }
  })
}

export function useAcoesGerente() {
  const queryClient = useQueryClient();

  const atualizarImagem = async (id_rest: string, gerente_atual: Gerente, img: string) => {
    gerenteFirestore.atualizar(id_rest, gerente_atual.id, { img_perfil: img })
    gerente_atual.img_perfil = img;
    await AsyncStorage.setItem('gerente', JSON.stringify(gerente_atual));
  }

  const atualizarFotoGerente = useMutation({
    mutationFn: ({props}: {props: {
      id_rest: string,
      gerente_atual: Gerente,
      img: string
    }}) => atualizarImagem(props.id_rest, props.gerente_atual, props.img),

    onSuccess: () => {
      console.info('foto do gerente atualizada com sucesso!')
      queryClient.invalidateQueries({
        queryKey: ['gerente_conectado'],
      });
    },

    onError: (error) => {
      console.error('Erro ao atualizar gerente conectado ', error);
    },
  });

  return {
    atualizarFotoGerente
  }
}