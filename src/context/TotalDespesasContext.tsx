import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useListarDespesasDoMes } from "../hooks/useDespesaFinancas";
import { useRestauranteId } from "../hooks/useRestaurante";
import { Despesa, DespesaPostRequestBody } from "../schema/financa.schema";

interface TotalDespesasContextType {
  totalDespesas: Despesa[] | undefined,
  adicionarNovaDespesa: (body: DespesaPostRequestBody) => void
}

const TotalDespesasContext = createContext<TotalDespesasContextType | undefined>(undefined)

export const TotalDespesasProvider = ({ children }: { children: ReactNode }) => {
  const [totalDespesas, setTotalDespesas] = useState<Despesa[] | undefined>(undefined)

  const [dataInicio, setDataInicio] = useState(new Date(new Date().setDate(1)))
  const [dataFim, setDataFim] = useState(new Date())

  const { data } = useRestauranteId()
  const { data: listaTotal, isLoading } = useListarDespesasDoMes(data?.uid!, {dataInicio, dataFim})

  const adicionarNovaDespesa = (body: DespesaPostRequestBody) => {
    setTotalDespesas(prev => ([...prev!, {
      categoria_ref: '',
      data_criacao: new Date(),
      id: Math.random().toString(),
      ...body,
    }]))
  }

  useEffect(() => {
    setTotalDespesas(listaTotal)
  }, [])

  return (
    <TotalDespesasContext.Provider value={{
      totalDespesas,
      adicionarNovaDespesa
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