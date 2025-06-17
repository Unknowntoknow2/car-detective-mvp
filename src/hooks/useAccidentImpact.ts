
import { useState, useCallback } from 'react';
import { AccidentHistory, AccidentImpact } from '@/types/accident';

export const useAccidentImpact = () => {
  const [impact, setImpact] = useState<AccidentImpact | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateImpact = useCallback(async (
    accidentHistory: AccidentHistory,
    baseValue: number
  ): Promise<AccidentImpact> => {
    setIsCalculating(true);
    
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
          case 'major':
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
        description: `Vehicle value reduced by ${percentImpact}% due to accident history`
      };
      
      setImpact(result);
      return result;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  return {
    impact,
    calculateImpact,
    isCalculating
  };
};
