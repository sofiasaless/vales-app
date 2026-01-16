import { useQuery } from "@tanstack/react-query";
import { incentivoFirestore } from "../firestore/incentivo.firestore";
import { funcinoarioIncentivosFirestore } from "../firestore/funcionario.incentivo.firestore";

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

export function useListarFuncionariosDoIncentivo(idIncentivo: string) {
  return useQuery({
    queryKey: ["funcionarios_incentivo"],
    queryFn: async () => {
      const res = await funcinoarioIncentivosFirestore.listar(idIncentivo);
      return res;
    }
  })
}