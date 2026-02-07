import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IncentivoFirestore, incentivoFirestore } from "../firestore/incentivo.firestore";
import { funcinoarioIncentivosFirestore } from "../firestore/funcionario.incentivo.firestore";
import { IncentivoPostRequestBody } from "../schema/incentivo.schema";
import { Funcionario } from "../schema/funcionario.schema";

export function useListarIncentivos(idRestaurante: string) {
  return useQuery({
    queryKey: ["incentivos", idRestaurante],
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
    queryKey: ["funcionarios_incentivo", idIncentivo],
    queryFn: async () => {
      const res = await funcinoarioIncentivosFirestore.listar(idIncentivo);
      return res;
    }
  })
}

export function useAcoesIncentivo() {
  const queryClient = useQueryClient();

  const criarIncentivo = useMutation({
    mutationFn: ({props}: {props: {
      idRestaurante: string, body: IncentivoPostRequestBody, funcionarios: Funcionario[]
    }}) => incentivoFirestore.criar(props.idRestaurante, props.body, props.funcionarios),

    onSuccess: () => {
      console.info('incentivo criado com sucesso')
      queryClient.invalidateQueries({queryKey: ["incentivo_ativo"]}),
      queryClient.invalidateQueries({queryKey: ["funcionarios_incentivo"]}),
      queryClient.invalidateQueries({queryKey: ["incentivos"]})
    },

    onError: (error) => {
      console.error('Erro ao criar o incentivo ', error);
    },
  });

  return {
    criarIncentivo
  }
}