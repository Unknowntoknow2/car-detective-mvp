
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface ValuationState {
  currentValuation: any | null;
  isLoading: boolean;
  error: string | null;
}

interface ValuationAction {
  type: 'SET_VALUATION' | 'SET_LOADING' | 'SET_ERROR' | 'CLEAR_ERROR';
  payload?: any;
}

const initialState: ValuationState = {
  currentValuation: null,
  isLoading: false,
  error: null,
};

const ValuationContext = createContext<{
  state: ValuationState;
  dispatch: React.Dispatch<ValuationAction>;
} | null>(null);

function valuationReducer(state: ValuationState, action: ValuationAction): ValuationState {
  switch (action.type) {
    case 'SET_VALUATION':
      return {
        ...state,
        currentValuation: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export function ValuationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(valuationReducer, initialState);

  return (
    <ValuationContext.Provider value={{ state, dispatch }}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuation() {
  const context = useContext(ValuationContext);
  if (!context) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
}
