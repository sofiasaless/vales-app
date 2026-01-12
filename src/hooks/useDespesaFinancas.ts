import { useQuery } from "@tanstack/react-query";
import { DateFilterProps, despesaFirestore } from "../firestore/despesa.firestore";

export function useListarDespesas(idCategoria: string, filtro: DateFilterProps) {
  return useQuery({
    queryKey: [
      'despesas',
      idCategoria,
      filtro.dataInicio.toISOString(),
      filtro.dataFim.toISOString()
    ],
    queryFn: async () => {
      const res = await despesaFirestore.listar(idCategoria, filtro)
      return res
    }
  })
}

export function useListarDespesasDoMes(idRestaurante: string, filtro: DateFilterProps) {
  return useQuery({
    queryKey: [
      'despesas_mes',
      filtro.dataFim,
      filtro.dataInicio
    ],
    queryFn: async () => {
      const res = despesaFirestore.listarDeTodasCategorias(idRestaurante, filtro);
      return res;
    }
  })
}