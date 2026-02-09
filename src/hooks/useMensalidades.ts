import { useQuery } from "@tanstack/react-query";
import { mensalidadeFirestore } from "../firestore/mensalidade.firestore";

export function useListarMensalidades(idRestaurante: string) {
  return useQuery({
    queryKey: ["mensalidades"],
    queryFn: async () => {
      const res = await mensalidadeFirestore.listar(idRestaurante);
      return res
    }
  })
}

