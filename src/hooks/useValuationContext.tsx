
import React, { createContext, useContext, useState } from 'react';

type ValuationContextType = {
  vinValue: string;
  setVinValue: (value: string) => void;
  plateValue: string;
  setPlateValue: (value: string) => void;
  stateValue: string;
  setStateValue: (value: string) => void;
  lookupMethod: 'vin' | 'plate' | 'manual';
  setLookupMethod: (method: 'vin' | 'plate' | 'manual') => void;
};

const defaultContext: ValuationContextType = {
  vinValue: '',
  setVinValue: () => {},
  plateValue: '',
  setPlateValue: () => {},
  stateValue: '',
  setStateValue: () => {},
  lookupMethod: 'vin',
  setLookupMethod: () => {},
};

const ValuationContext = createContext<ValuationContextType>(defaultContext);

export const ValuationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vinValue, setVinValue] = useState('');
  const [plateValue, setPlateValue] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [lookupMethod, setLookupMethod] = useState<'vin' | 'plate' | 'manual'>('vin');

  return (
    <ValuationContext.Provider
      value={{
        vinValue,
        setVinValue,
        plateValue,
        setPlateValue,
        stateValue,
        setStateValue,
        lookupMethod,
        setLookupMethod,
      }}
    >
      {children}
    </ValuationContext.Provider>
  );
};

export const useValuationContext = () => useContext(ValuationContext);
