import { useQuery } from "@tanstack/react-query"
import { RestauranteSerivce } from "../auth/restaurante.service"

export function useRestauranteConectado() {
  return useQuery({
    queryKey: ["restaurante_conectado"],
    queryFn: async () => {
      const restServ = new RestauranteSerivce()
      return restServ.getRestauranteLogado()
    },
    refetchOnReconnect: true,
    refetchInterval: 30 * 60 * 1000
  })
}