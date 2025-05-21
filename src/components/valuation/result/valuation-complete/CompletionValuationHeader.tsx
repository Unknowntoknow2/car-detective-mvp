
import React from 'react';

interface CompletionValuationHeaderProps {
  make?: string;
  model?: string;
  year?: number;
  estimatedValue?: number;
}

export const CompletionValuationHeader: React.FC<CompletionValuationHeaderProps> = ({
  make, 
  model, 
  year,
  estimatedValue
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">
        {year} {make} {model} Valuation
      </h1>
      {estimatedValue && (
        <div className="mt-2 text-xl font-semibold text-green-600">
          Estimated Value: ${estimatedValue.toLocaleString()}
        </div>
      )}
    </div>
  );
};
