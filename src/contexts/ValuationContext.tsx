
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface ValuationState {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}

type ValuationAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: any };

const initialState: ValuationState = {
  isLoading: false,
  error: null,
  data: null
};

function valuationReducer(state: ValuationState, action: ValuationAction): ValuationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    default:
      return state;
  }
}

interface ValuationContextType {
  state: ValuationState;
  dispatch: React.Dispatch<ValuationAction>;
  processFreeValuation: (data: any) => Promise<{ valuationId: string }>;
  processPremiumValuation: (data: any) => Promise<{ valuationId: string }>;
  isLoading: boolean;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export function ValuationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(valuationReducer, initialState);

  const processFreeValuation = async (data: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock implementation
      const valuationId = `free-${Date.now()}`;
      dispatch({ type: 'SET_DATA', payload: { valuationId, ...data } });
      return { valuationId };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process free valuation' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const processPremiumValuation = async (data: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock implementation
      const valuationId = `premium-${Date.now()}`;
      dispatch({ type: 'SET_DATA', payload: { valuationId, ...data } });
      return { valuationId };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process premium valuation' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ValuationContext.Provider value={{
      state,
      dispatch,
      processFreeValuation,
      processPremiumValuation,
      isLoading: state.isLoading
    }}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuation() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
}
