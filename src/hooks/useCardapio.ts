import { useQuery } from "@tanstack/react-query";
import { MenuFirestore } from "../firestore/menu.firestore";

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