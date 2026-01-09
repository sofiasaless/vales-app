import { useState } from "react"
import { FuncionarioFirestore } from "../firestore/funcionario.firestore"
import { Vale } from "../schema/vale.shema"

export function useVales() {
  const funcFir = new FuncionarioFirestore()

  const [isLoading, setIsLoading] = useState(false)

  const adicionarVale = async (id: string, vale: Vale) => {
    setIsLoading(true)
    try {
      await funcFir.adicionarVale(id, vale)
      return true
    } catch (error: any) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removerVale = async (id: string, vale: Vale) => {
    setIsLoading(true)
    try {
      await funcFir.removerVale(id, vale)
      return true
    } catch (error: any) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const [isLoadingVales, setIsLoadingVales] = useState(false)
  const [vales, setVales] = useState<Vale[]>()
  const listarVales = async (id: string) => {
    setIsLoadingVales(true)
    try {
      const res = await funcFir.encontrarPorId(id);
      setVales(res.vales)
      return res.vales
    } catch (error) {
      setVales(undefined)
    } finally {
      setIsLoadingVales(false)
    }
  }

  return {
    isLoading,
    adicionarVale,
    removerVale,
    listarVales,
    vales,
    isLoadingVales
  }
}