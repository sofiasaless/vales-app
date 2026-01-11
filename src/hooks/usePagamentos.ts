import { useState } from "react";
import { PagamentoPostRequestBody } from "../schema/pagamento.schema";
import { errorHookResponse, successHookResponse } from "../types/hookResponse.type";
import { pagamentoFirestore } from "../firestore/pagamento.firestore";
import { useQuery } from "@tanstack/react-query";

export function usePagamentos() {
  const [isLoading, setIsLoading] = useState(false)
  const pagarFuncionario = async (idFunc: string, body: PagamentoPostRequestBody) => {
    try {
      setIsLoading(true)
      pagamentoFirestore.criar(idFunc, body);
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

export function useHistoricoPagamentos(idFunc: string) {
  return useQuery({
    queryKey: ["historico_pagamentos"],
    queryFn: async () => {
      const res = await pagamentoFirestore.listar(idFunc)
      return res
    }
  })
}