// import React, { createContext, useCallback, useContext, useState, type ReactNode } from "react";
// import { Vale } from "../schema/vale.shema";

// interface ItenValesContextType {
//   itensVales: Map<string, Vale>;
//   adicionarItem: (item: Vale) => void;
//   removerItem: (prod_ref: string) => void;
//   limparItens: () => void;
//   isVazio: () => boolean;
//   atualizarQuantidade: (id: string, qtd: number) => void;
//   tamanho: number
// }

// const ItenValesContext = createContext<ItenValesContextType | undefined>(undefined);

// export const ItenValesProvider = ({ children }: { children: ReactNode }) => {
//   const [itensVales, setItensVales] = useState<Map<string, Vale>>(new Map);

//   const adicionarItem = useCallback((item: Vale) => {
//     setItensVales(prev => {
//       const novo = new Map(prev);
//       novo.set(item.produto_ref!, item);
//       return novo;
//     });
//   }, []);

//   const removerItem = useCallback((prod_ref: string) => {
//     setItensVales(prev => {
//       const novo = new Map(prev);
//       novo.delete(prod_ref);
//       return novo;
//     });
//   }, []);

//   const limparItens = useCallback(() => {
//     setItensVales(new Map);
//   }, []);

//   const atualizarQuantidade = useCallback((id: string, qtd: number) => {
//     setItensVales(prev => {
//       const novo = new Map(prev);
//       const item = novo.get(id);

//       if (!item) return prev;

//       const atualizado = { ...item, quantidade: item.quantidade + qtd };

//       if (atualizado.quantidade <= 0) {
//         novo.delete(id);
//       } else {
//         novo.set(id, atualizado);
//       }

//       return novo;
//     });
//   }, [])

//   const isVazio = () => {
//     return (itensVales.size === 0)
//   }

//   const tamanho = itensVales.size

//   return (
//     <ItenValesContext.Provider value={{ itensVales, adicionarItem, removerItem, limparItens, isVazio, tamanho, atualizarQuantidade }}
//     >
//       {children}
//     </ItenValesContext.Provider>
//   );
// };

// export const useItensVales = () => {
//   const context = useContext(ItenValesContext);
//   if (!context) {
//     throw new Error("useItensVale deve ser usado dentro de um ItenValesProvider");
//   }
//   return context;
// };

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Vale } from "../schema/vale.shema";

/* =======================
   CONTEXTOS SEPARADOS
======================= */

interface ItensValesState {
  itensVales: Map<string, Vale>;
  tamanho: number;
  isVazio: boolean;
}

interface ItensValesActions {
  adicionarItem: (item: Vale) => void;
  removerItem: (id: string) => void;
  atualizarQuantidade: (id: string, qtd: number) => void;
  limparItens: () => void;
}

const ItensValesStateContext = createContext<ItensValesState | null>(null);
const ItensValesActionsContext = createContext<ItensValesActions | null>(null);

/* =======================
   PROVIDER
======================= */

export const ItenValesProvider = ({ children }: { children: ReactNode }) => {
  const [itensVales, setItensVales] = useState<Map<string, Vale>>(new Map());

  /* -------- AÇÕES -------- */

  const adicionarItem = useCallback((item: Vale) => {
    setItensVales(prev => {
      const novo = new Map(prev);
      novo.set(item.produto_ref!, item);
      return novo;
    });
  }, []);

  const removerItem = useCallback((id: string) => {
    setItensVales(prev => {
      const novo = new Map(prev);
      novo.delete(id);
      return novo;
    });
  }, []);

  const atualizarQuantidade = useCallback((id: string, qtd: number) => {
    setItensVales(prev => {
      const novo = new Map(prev);
      const item = novo.get(id);

      if (!item) return prev;

      const atualizado = {
        ...item,
        quantidade: item.quantidade + qtd,
      };

      if (atualizado.quantidade <= 0) {
        novo.delete(id);
      } else {
        novo.set(id, atualizado);
      }

      return novo;
    });
  }, []);

  const limparItens = useCallback(() => {
    setItensVales(new Map());
  }, []);

  /* -------- ESTADO DERIVADO -------- */

  const stateValue = useMemo<ItensValesState>(() => ({
    itensVales,
    tamanho: itensVales.size,
    isVazio: itensVales.size === 0,
  }), [itensVales]);

  const actionsValue = useMemo<ItensValesActions>(() => ({
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparItens,
  }), [adicionarItem, removerItem, atualizarQuantidade, limparItens]);

  return (
    <ItensValesActionsContext.Provider value={actionsValue}>
      <ItensValesStateContext.Provider value={stateValue}>
        {children}
      </ItensValesStateContext.Provider>
    </ItensValesActionsContext.Provider>
  );
};

/* =======================
   HOOKS
======================= */

export const useItensValesState = () => {
  const ctx = useContext(ItensValesStateContext);
  if (!ctx) throw new Error("useItensValesState deve ser usado no provider");
  return ctx;
};

export const useItensValesActions = () => {
  const ctx = useContext(ItensValesActionsContext);
  if (!ctx) throw new Error("useItensValesActions deve ser usado no provider");
  return ctx;
};
