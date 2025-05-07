
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValuationResultProps {
  valuationId: string;
  manualValuation?: any;
  photoCondition?: any;
}

export const ValuationResult: React.FC<ValuationResultProps> = ({ 
  valuationId, 
  manualValuation,
  photoCondition 
}) => {
  return (
    <Card className="bg-white border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle>Valuation Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">Valuation ID</p>
          <p className="text-md font-medium">{valuationId}</p>
          {manualValuation && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Manual Valuation Data</p>
              <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(manualValuation, null, 2)}
              </pre>
            </div>
          )}
          {photoCondition && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Photo Condition Assessment</p>
              <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(photoCondition, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Make sure it's also exported as default
export default ValuationResult;
