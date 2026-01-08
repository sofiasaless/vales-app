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

  return {
    isLoading,
    adicionarVale
  }
}