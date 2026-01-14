import { useQuery } from "@tanstack/react-query";
import { incentivoFirestore } from "../firestore/incentivo.firestore";

export function useListarIncentivos(idRestaurante: string) {
  return useQuery({
    queryKey: ["incentivos"],
    queryFn: async () => {
      const res = await incentivoFirestore.listar(idRestaurante);
      return res;
    }
  })
}

export function useIncentivoAtivo(idRestaurante: string) {
  return useQuery({
    queryKey: ["incentivo_ativo"],
    queryFn: async () => {
      const res = await incentivoFirestore.encontrarPorStatus(idRestaurante, true);
      if (res.length === 0) return null;
      return res[0];
    }
  })
} 