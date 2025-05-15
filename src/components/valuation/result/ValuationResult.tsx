
import React from 'react';
import { ValuationResult as ValuationResultType } from '@/types/valuation';

interface ValuationResultProps {
  valuation: ValuationResultType;
  isPremium?: boolean;
}

export const ValuationResult: React.FC<ValuationResultProps> = ({ valuation, isPremium = false }) => {
  return (
    <div className="valuation-result">
      <h2 className="text-2xl font-bold mb-4">
        {valuation.year} {valuation.make} {valuation.model}
      </h2>
      <div className="text-xl mb-2">
        Estimated Value: ${valuation.estimatedValue.toLocaleString()}
      </div>
      <div className="text-sm text-gray-600">
        Condition: {valuation.condition}
      </div>
    </div>
  );
};

export default ValuationResult;
