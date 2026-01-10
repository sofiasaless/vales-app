import { useState } from "react"
import { RestauranteSerivce } from "../auth/restaurante.service"
import { errorHookResponse, successHookResponse } from "../types/hookResponse.type"

export function useSair() {

  const [isLoading, setIsLoading] = useState(false)

  const sairDasContas = async () => {
    try {
      setIsLoading(true)
      const resServ = new RestauranteSerivce()
      await resServ.desconectar()
      return successHookResponse();
    } catch (error) {
      return errorHookResponse(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    sairDasContas
  }
}