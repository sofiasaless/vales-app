import { useQuery } from "@tanstack/react-query";
import { categoriaFinancas } from "../firestore/categoriaFinanca.firestore";

export function useListarCategorias(idRestaurante: string) {
  return useQuery({
    queryKey: ["categorias_financas"],
    queryFn: async () => {
      const res = await categoriaFinancas.listar(idRestaurante)
      return res
    }
  })
}