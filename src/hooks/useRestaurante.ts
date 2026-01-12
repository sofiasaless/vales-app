import { useQuery } from "@tanstack/react-query"
import { RestauranteSerivce } from "../auth/restaurante.service"
import { RestarautenFirestore } from "../firestore/restaurante.firestore"

export function useRestauranteConectado() {
  return useQuery({
    queryKey: ["restaurante_conectado"],
    queryFn: async () => {
      const restServ = new RestauranteSerivce()
      const authRes = restServ.getRestauranteLogado()
    
      const restFir = new RestarautenFirestore()
      const res = await restFir.encontrarPorId(authRes!.uid)
      return res
    },
    refetchOnReconnect: true,
    refetchInterval: 30 * 60 * 1000
  })
}

export function useRestauranteId() {
  return useQuery({
    queryKey: ["restaurante_id"],
    queryFn: () => {
      const restServ = new RestauranteSerivce()
      return restServ.getRestauranteLogado()
    }
  })
}