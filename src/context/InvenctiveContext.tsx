import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Incentivo, IncentivoPostRequestBody } from '../schema/incentivo.schema';

export interface IncentiveState {
  incentivos: Incentivo[];
  // Map de employee ID -> contador para o incentivo ativo
  employeeCounters: Record<string, number>;
}

type IncentiveAction =
  | { type: 'ADD_INCENTIVE'; payload: IncentivoPostRequestBody }
  | { type: 'INCREMENT_COUNTER'; payload: { employeeId: string; incentivoId: string } }
  | { type: 'DECREMENT_COUNTER'; payload: { employeeId: string; incentivoId: string } }
  | { type: 'SET_WINNER'; payload: { incentivoId: string; employeeId: string; employeeName: string } }
  | { type: 'EXPIRE_INCENTIVE'; payload: string };

const initialState: IncentiveState = {
  incentivos: [
    {
      id: 'inc-1',
      valor_incentivo: 150,
      descricao: 'Kibbe',
      meta: 20,
      status: true,
      data_expiracao: new Date('2024-01-15'),
      ganhador_nome: undefined,
      ganhador_ref: undefined,
      data_adicao: new Date('2024-01-01'),
      restaurante_ref: ''
    },
    {
      id: 'inc-1',
      valor_incentivo: 200,
      descricao: 'Moela',
      meta: 25,
      status: false,
      data_expiracao: new Date('2024-01-15'),
      ganhador_nome: 'Antonio',
      ganhador_ref: 'emp-1',
      data_adicao: new Date('2024-01-01'),
      restaurante_ref: ''
    },
  ],
  employeeCounters: {},
};

function incentiveReducer(state: IncentiveState, action: IncentiveAction): IncentiveState {
  switch (action.type) {
    case 'ADD_INCENTIVE': {
      const newIncentivo: Incentivo = {
        id: `inc-${Date.now()}`,
        ...action.payload,
        status: true,
        data_adicao: new Date(),
        restaurante_ref: '',
      };
      return {
        ...state,
        incentivos: [...state.incentivos, newIncentivo],
        employeeCounters: {},
      };
    }

    case 'INCREMENT_COUNTER': {
      const { employeeId, incentivoId } = action.payload;
      const incentivo = state.incentivos.find(i => i.id === incentivoId);
      
      if (!incentivo || !incentivo.status || incentivo.ganhador_ref) {
        return state;
      }

      const currentCount = state.employeeCounters[employeeId] || 0;
      const newCount = currentCount + 1;

      // Check if this employee reached the goal
      if (newCount >= incentivo.meta) {
        return {
          ...state,
          employeeCounters: {
            ...state.employeeCounters,
            [employeeId]: newCount,
          },
          incentivos: state.incentivos.map(i =>
            i.id === incentivoId
              ? { ...i, ganhador_id: employeeId }
              : i
          ),
        };
      }

      return {
        ...state,
        employeeCounters: {
          ...state.employeeCounters,
          [employeeId]: newCount,
        },
      };
    }

    case 'DECREMENT_COUNTER': {
      const { employeeId } = action.payload;
      const currentCount = state.employeeCounters[employeeId] || 0;
      
      if (currentCount <= 0) return state;

      return {
        ...state,
        employeeCounters: {
          ...state.employeeCounters,
          [employeeId]: currentCount - 1,
        },
      };
    }

    case 'SET_WINNER': {
      const { incentivoId, employeeId, employeeName } = action.payload;
      return {
        ...state,
        incentivos: state.incentivos.map(i =>
          i.id === incentivoId
            ? { ...i, ganhador_id: employeeId, ganhador_nome: employeeName, status: false }
            : i
        ),
      };
    }

    case 'EXPIRE_INCENTIVE': {
      return {
        ...state,
        incentivos: state.incentivos.map(i =>
          i.id === action.payload
            ? { ...i, status: false }
            : i
        ),
      };
    }

    default:
      return state;
  }
}

interface IncentiveContextType {
  state: IncentiveState;
  dispatch: React.Dispatch<IncentiveAction>;
  getEmployeeCounter: (employeeId: string) => number;
  addIncentive: (data: IncentivoPostRequestBody) => void;
  incrementCounter: (employeeId: string) => void;
  decrementCounter: (employeeId: string) => void;
  setWinner: (employeeId: string, employeeName: string) => void;
}

const IncentiveContext = createContext<IncentiveContextType | undefined>(undefined);

export function IncentiveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(incentiveReducer, initialState);

  const getActiveIncentive = (): Incentivo => {
    return {
      id: 'inc-1',
      valor_incentivo: 200,
      descricao: 'Moela',
      meta: 25,
      status: false,
      data_expiracao: new Date('2024-01-15'),
      data_adicao: new Date('2024-01-01'),
      restaurante_ref: ''
    }
  };

  const getEmployeeCounter = (employeeId: string): number => {
    return state.employeeCounters[employeeId] || 0;
  };

  const addIncentive = (data: IncentivoPostRequestBody) => {
    dispatch({ type: 'ADD_INCENTIVE', payload: data });
  };

  const incrementCounter = (employeeId: string) => {
    const activeIncentive = getActiveIncentive();
    if (activeIncentive) {
      dispatch({
        type: 'INCREMENT_COUNTER',
        payload: { employeeId, incentivoId: activeIncentive.id },
      });
    }
  };

  const decrementCounter = (employeeId: string) => {
    const activeIncentive = getActiveIncentive();
    if (activeIncentive) {
      dispatch({
        type: 'DECREMENT_COUNTER',
        payload: { employeeId, incentivoId: activeIncentive.id },
      });
    }
  };

  const setWinner = (employeeId: string, employeeName: string) => {
    const activeIncentive = getActiveIncentive();
    if (activeIncentive) {
      dispatch({
        type: 'SET_WINNER',
        payload: { incentivoId: activeIncentive.id, employeeId, employeeName },
      });
    }
  };

  return (
    <IncentiveContext.Provider
      value={{
        state,
        dispatch,
        getEmployeeCounter,
        addIncentive,
        incrementCounter,
        decrementCounter,
        setWinner,
      }}
    >
      {children}
    </IncentiveContext.Provider>
  );
}

export function useIncentive() {
  const context = useContext(IncentiveContext);
  if (!context) {
    throw new Error('useIncentive must be used within an IncentiveProvider');
  }
  return context;
}
