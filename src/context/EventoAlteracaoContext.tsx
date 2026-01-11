import { createContext, useContext, useState, type ReactNode } from "react";

interface EventoAlteracoesContextType {
  novaAdicaoVale: boolean,
  eventoNovaAdicaoVale: () => void
}

const EventoAlteracoesContext = createContext<EventoAlteracoesContextType | undefined>(undefined)

export const EventoAlteracoesProvider = ({ children }: { children: ReactNode }) => {
  const [novaAdicaoVale, setNovaAdicaoVale] = useState<boolean>(false)
  const eventoNovaAdicaoVale = () => {
    setNovaAdicaoVale(!novaAdicaoVale);
  }

  return (
    <EventoAlteracoesContext.Provider value={{
      novaAdicaoVale,
      eventoNovaAdicaoVale
    }}>
      {children}
    </EventoAlteracoesContext.Provider>
  )
};

export const useEventoAlteracoesContext = () => {
  const context = useContext(EventoAlteracoesContext);
  if (!context) {
    throw new Error("useEventoAlteracoesContext deve ser usado dentro de um EstoqueProvider");
  }
  return context;
}