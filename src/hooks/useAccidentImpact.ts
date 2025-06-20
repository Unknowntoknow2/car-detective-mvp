
import { useState, useCallback } from 'react';
import React from 'react';
import { AccidentDetails } from '@/types/follow-up-answers';

export interface AccidentImpact {
  totalImpact: number;
  percentImpact: number;
  dollarImpact: number;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  recommendations: string[];
  isPremium: boolean;
}

// Legacy alias for backward compatibility
export type AccidentHistory = AccidentDetails;

export const useAccidentImpact = (
  baseValue: number,
  accidentHistory: AccidentDetails,
  vin?: string,
  valuationId?: string
) => {
  const [impact, setImpact] = useState<AccidentImpact | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateImpact = useCallback(async (
    accidentHistory: AccidentDetails,
    baseValue: number
  ): Promise<AccidentImpact> => {
    setIsCalculating(true);
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock calculation logic
      let totalImpact = 0;
      
      if (accidentHistory.hadAccident) {
        switch (accidentHistory.severity) {
          case 'minor':
            totalImpact = 5;
            break;
          case 'moderate':
            totalImpact = 15;
            break;
          case 'severe':
            totalImpact = 30;
            break;
        }
        
        if (accidentHistory.frameDamage) {
          totalImpact += 10;
        }
        
        if (accidentHistory.airbagDeployment) {
          totalImpact += 5;
        }
      }
      
      const percentImpact = totalImpact;
      const dollarImpact = (baseValue * totalImpact) / 100;
      
      const result: AccidentImpact = {
        totalImpact,
        percentImpact,
        dollarImpact,
        severity: accidentHistory.severity || 'minor',
        description: `Vehicle value reduced by ${percentImpact}% due to accident history`,
        recommendations: [
          'Get a professional inspection',
          'Obtain detailed repair records',
          'Consider comprehensive insurance'
        ],
        isPremium: false
      };
      
      setImpact(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate accident impact';
      setError(errorMessage);
      throw err;
    } finally {
      setIsCalculating(false);
      setIsLoading(false);
    }
  }, []);

  // Auto-calculate on mount
  React.useEffect(() => {
    if (baseValue && accidentHistory) {
      calculateImpact(accidentHistory, baseValue);
    }
  }, [baseValue, accidentHistory, calculateImpact]);

  // Return all the properties that components expect
  return {
    impact,
    calculateImpact,
    isCalculating,
    isLoading,
    error,
    // Derived properties for easier access
    percentImpact: impact?.percentImpact || 0,
    dollarImpact: impact?.dollarImpact || 0,
    description: impact?.description || '',
    recommendations: impact?.recommendations || [],
    isPremium: impact?.isPremium || false
  };
};
