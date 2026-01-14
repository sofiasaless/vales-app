import { useState } from "react"
import { FuncionarioFirestore } from "../firestore/funcionario.firestore"
import { Funcionario } from "../schema/funcionario.schema"
import { useQuery } from "@tanstack/react-query"


export function useFuncionarios() {
  const funcFir = new FuncionarioFirestore()

  const [isLoading, setIsLoading] = useState(false)

  const [isLoadingF, setIsLoadingF] = useState(false)
  const [funcionarioFoco, setFuncionarioFoco] = useState<Funcionario>()
  const encontrarPorId = async (id: string) => {
    setIsLoadingF(true)
    try {
      const data = await funcFir.encontrarPorId(id)
      setFuncionarioFoco(data)
    } catch (error: any) {
      console.error(error)
      setFuncionarioFoco(undefined)
    } finally {
      setIsLoadingF(false)
    }
  }

  return {
    funcionarioFoco,
    encontrarPorId,
    isLoading,
    isLoadingF
  }
}

export function useFuncionariosRestaurante(restauranteId: string, force: boolean = false) {
  return useQuery({
    queryKey: ["funcionarios",
      force.valueOf()
    ],
    queryFn: async () => {
      const funcFir = new FuncionarioFirestore()
      const res = await funcFir.listar(restauranteId)
      return res
    },
    refetchOnReconnect: true,
    refetchInterval: 30 * 60 * 1000
  })
}