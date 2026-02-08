import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { GerenteService } from "../auth/gerente.service";
import { GerenteFirestore } from "../firestore/gerente.firestore";
import { Gerente } from "../schema/gerente.schema";
import { errorHookResponse, successHookResponse } from "../types/hookResponse.type";
import { usePushNotifications } from "./usePushNotifications";

export function useLoginGerente() {

  usePushNotifications()

  const gerenteSerivce = new GerenteService()
  const gerenteFirestore = new GerenteFirestore()

  const [isLoading, setIsLoading] = useState(false)
  const entrarComGerente = async (idRestaurante: string, id: string, senha: string) => {
    setIsLoading(true)
    try {
      const res = await gerenteSerivce.logar(idRestaurante, id, senha);
      await AsyncStorage.setItem('gerente', JSON.stringify(res));
      return successHookResponse()
    } catch (error: any) {
      return errorHookResponse(error);
    } finally {
      setIsLoading(false)
    }
  }

  const [gerentes, setGerentes] = useState<Gerente[]>()
  const [isLoadingGerentes, setIsLoadingGerentes] = useState(false)
  const listarGerentes = async (idRestaurante: string) => {
    try {
      setIsLoadingGerentes(true)
      const res = await gerenteFirestore.listar(idRestaurante);
      setGerentes(res)
    } catch (error) {
      return errorHookResponse(error)
    } finally {
      setIsLoadingGerentes(false)
    }
  }

  return {
    isLoading,
    entrarComGerente,
    gerentes,
    isLoadingGerentes,
    listarGerentes
  }
}