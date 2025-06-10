
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ValuationCompleteProps {
  estimatedValue: number;
}

export const ValuationComplete: React.FC<ValuationCompleteProps> = ({ estimatedValue }) => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Valuation Complete!</h2>
        <p className="text-3xl font-bold text-primary">
          ${estimatedValue.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default ValuationComplete;
