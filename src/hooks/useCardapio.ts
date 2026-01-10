import { useQuery } from "@tanstack/react-query";
import { MenuFirestore } from "../firestore/menu.firestore";

export function useCardapio(idGerente: string) {
  return useQuery({
    queryKey: ["cardapio"],
    queryFn: async () => {
      const menuFir = new MenuFirestore()
      const res = await menuFir.listar(idGerente)
      return res;
    },
    refetchInterval: 30 * 60 * 1000
  })
}