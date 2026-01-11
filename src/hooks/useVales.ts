import { useState } from "react"
import { funcionarioFirestore, FuncionarioFirestore } from "../firestore/funcionario.firestore"
import { Vale } from "../schema/vale.shema"
import { errorHookResponse, successHookResponse } from "../types/hookResponse.type"
import { useQuery } from "@tanstack/react-query"

export function useVales() {

  const [isLoading, setIsLoading] = useState(false)

  const adicionarVale = async (id: string, vale: Vale) => {
    setIsLoading(true)
    try {
      await funcionarioFirestore.adicionarVale(id, vale)
      return successHookResponse()
    } catch (error: any) {
      return errorHookResponse(error)
    } finally {
      setIsLoading(false)
    }
  }

  const adicionarVales = async (id: string, vales: Vale[]) => {
    setIsLoading(true)
    try {
      vales.map(async (v) => {
        await adicionarVale(id, v)
      })
      return successHookResponse()
    } catch (error: any) {
      return errorHookResponse(error)
    } finally {
      setIsLoading(false)
    }
  }

  const removerVale = async (id: string, vale: Vale) => {
    setIsLoading(true)
    try {
      await funcionarioFirestore.removerVale(id, vale)
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
      const res = await funcionarioFirestore.encontrarPorId(id);
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
    adicionarVales,
    removerVale,
    listarVales,
    vales,
    isLoadingVales
  }
}