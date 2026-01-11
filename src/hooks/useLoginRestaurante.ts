import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { errorHookResponse, successHookResponse } from "../types/hookResponse.type";

export function useLoginRestaurante() {
  const restServ = new RestauranteSerivce()

  const [isLoading, setIsLoading] = useState(false)

  const entrarComRestaurante = async (email: string, senha: string) => {
    setIsLoading(true)
    try {
      const res = await restServ.logar(email, senha);
      await AsyncStorage.setItem('uid', res.uid);
      return successHookResponse({data: res})
    } catch (error: any) {
      return errorHookResponse(error);
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    entrarComRestaurante,
  }
}