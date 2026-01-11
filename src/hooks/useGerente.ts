import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { Gerente } from "../schema/gerente.schema";

export function useGerenteConectado() {
  return useQuery({
    queryKey: ["gerente_conectado"],
    queryFn: async () => {
      const string_res = await AsyncStorage.getItem('gerente')
      if (string_res) {
        const res = JSON.parse(string_res) as Gerente
        return res
      }    
    },
    refetchOnReconnect: true,
    refetchInterval: 30 * 60 * 1000
  })
}