import { useState } from "react"
import { FuncionarioFirestore } from "../firestore/funcionario.firestore"
import { Funcionario } from "../schema/funcionario.schema"


export function useFuncionarios() {
  const funcFir = new FuncionarioFirestore()

  const [isLoading, setIsLoading] = useState(false)

  const [listaFuncionarios, setListaFuncionarios] = useState<Funcionario[]>()
  const listarFuncionarios = async () => {
    setIsLoading(true)
    try {
      const data = await funcFir.listar()
      setListaFuncionarios(data)
    } catch (error: any) {
      setListaFuncionarios(undefined)
    } finally {
      setIsLoading(false)
    }
  }

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
    listarFuncionarios,
    listaFuncionarios,
    funcionarioFoco,
    encontrarPorId,
    isLoading,
    isLoadingF
  }
}