import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useListarDespesasDoMes } from "../hooks/useDespesaFinancas";
import { useRestauranteConectado, useRestauranteId } from "../hooks/useRestaurante";
import { Despesa, DespesaPostRequestBody } from "../schema/financa.schema";
import { DateFilterProps } from "../firestore/despesa.firestore";

interface TotalDespesasContextType {
  totalDespesas: Despesa[] | undefined,
  adicionarNovaDespesa: (body: DespesaPostRequestBody) => void,
  filtrarPorDatas: (datas: DateFilterProps) => Promise<void>,
  resetarDatas: () => void
}

const TotalDespesasContext = createContext<TotalDespesasContextType | undefined>(undefined)

export const TotalDespesasProvider = ({ children }: { children: ReactNode }) => {
  const [totalDespesas, setTotalDespesas] = useState<Despesa[] | undefined>(undefined)

  const [dataInicio, setDataInicio] = useState(new Date(new Date().setDate(1)))
  const [dataFim, setDataFim] = useState(new Date())

  const { data, isLoading: carregandoRes } = useRestauranteConectado()
  const { data: listaTotal, isLoading, refetch } = useListarDespesasDoMes(data?.id!, { dataInicio, dataFim })

  const adicionarNovaDespesa = (body: DespesaPostRequestBody) => {
    setTotalDespesas(prev => ([...prev!, {
      categoria_ref: '',
      data_criacao: new Date(),
      id: Math.random().toString(),
      ...body,
    }]))
  }

  const buscarTotal = async () => {
    setTotalDespesas(listaTotal)
  }

  const resetarDatas = () => {
    setDataInicio(new Date(new Date().setDate(1)))
    setDataFim(new Date())
  }

  const filtrarPorDatas = async (datas: DateFilterProps) => {
    setDataFim(datas.dataFim)
    setDataInicio(datas.dataInicio)
    await refetch()
  }

  useEffect(() => {
    buscarTotal()
  }, [isLoading, carregandoRes, listaTotal, data])

  return (
    <TotalDespesasContext.Provider value={{
      totalDespesas,
      adicionarNovaDespesa,
      filtrarPorDatas,
      resetarDatas
    }}>
      {children}
    </TotalDespesasContext.Provider>
  )
};

export const useTotalDespesasContext = () => {
  const context = useContext(TotalDespesasContext);
  if (!context) {
    throw new Error("useTotalDespesasContext deve ser usado dentro de um EstoqueProvider");
  }
  return context;
}