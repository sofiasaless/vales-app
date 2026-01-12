import { useState } from "react";
import { PagamentoPostRequestBody } from "../schema/pagamento.schema";
import { errorHookResponse, successHookResponse } from "../types/hookResponse.type";
import { pagamentoFirestore } from "../firestore/pagamento.firestore";
import { useQuery } from "@tanstack/react-query";
import { DateFilterProps } from "../firestore/despesa.firestore";

export function usePagamentos() {
  const [isLoading, setIsLoading] = useState(false)
  const pagarFuncionario = async (idFunc: string, body: PagamentoPostRequestBody) => {
    try {
      setIsLoading(true)
      await pagamentoFirestore.criar(idFunc, body);
      return successHookResponse()
    } catch (error) {
      return errorHookResponse(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    pagarFuncionario
  }
}

export function useHistoricoPagamentos(idFunc: string, datas: DateFilterProps) {
  return useQuery({
    queryKey: [
      "historico_pagamentos",
      datas.dataFim.toISOString(),
      datas.dataInicio.toISOString()
    ],
    queryFn: async () => {
      const res = await pagamentoFirestore.listar(idFunc, datas)
      return res
    }
  })
}