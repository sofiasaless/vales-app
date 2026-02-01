import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
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
