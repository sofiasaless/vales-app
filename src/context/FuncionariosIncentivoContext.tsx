import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useIncentivoAtivo, useListarFuncionariosDoIncentivo } from "../hooks/useIncentivo";
import { useRestauranteConectado, useRestauranteId } from "../hooks/useRestaurante";

interface FuncionariosIncentivoContextType {
  funcionariosIncentivo: Map<string, number>,
  incrementar: (idFunc: string, valor: number) => void
}

const FuncionariosIncentivoContext = createContext<FuncionariosIncentivoContextType | undefined>(undefined)

export const FuncionariosIncentivoProvider = ({ children }: { children: ReactNode }) => {
  const [funcionariosIncentivo, setFuncionariosIncentivo] = useState<Map<string, number>>(new Map)

  const incrementar = (idFunc: string, valor: number) => {
    setFuncionariosIncentivo(prev => {
      const novo = new Map(prev);
      const valor_atual = novo.get(idFunc) || 0
      novo.set(idFunc, (valor_atual + valor));
      return novo;
    });
  }

  const { data: res, isLoading: carregandoRes } = useRestauranteId()
  const { data: ince_ativo, isLoading: carregandoInc, refetch } = useIncentivoAtivo(res?.uid || '');
  const { data: funcionarios, isLoading: carregandoFuc, refetch: refetchFunc } = useListarFuncionariosDoIncentivo(ince_ativo?.id || '');

  useEffect(() => {
    if (carregandoRes || carregandoInc) return;

    refetchFunc()

    if (carregandoFuc) return;

    funcionarios?.map((f) => {
      setFuncionariosIncentivo(prev => {
        const novo = new Map(prev);
        novo.set(f.id, f.contador);
        return novo;
      });
    })

  }, [carregandoInc, carregandoRes, carregandoFuc]);

  return (
    <FuncionariosIncentivoContext.Provider value={{
      funcionariosIncentivo,
      incrementar
    }}>
      {children}
    </FuncionariosIncentivoContext.Provider>
  )
};

export const useFuncionariosIncentivoContext = () => {
  const context = useContext(FuncionariosIncentivoContext);
  if (!context) {
    throw new Error("useFuncionariosIncentivoContext deve ser usado dentro de um EstoqueProvider");
  }
  return context;
}