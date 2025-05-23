
import React from 'react';
import { ValuationResult } from '@/types/valuation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown, AlertTriangle } from 'lucide-react';

interface ValuationHistoryProps {
  valuations: ValuationResult[];
  isLoading: boolean;
  error: string | null;
  onDownloadPdf: (valuation: ValuationResult) => Promise<void>;
}

export const ValuationHistory: React.FC<ValuationHistoryProps> = ({ 
  valuations, 
  isLoading, 
  error,
  onDownloadPdf
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">Error Loading Valuations</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (valuations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No valuations found. Create your first valuation to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Recent Valuations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {valuations.map((valuation) => (
          <Card key={valuation.id} className="overflow-hidden">
            <CardHeader className="bg-muted/40 pb-2">
              <CardTitle className="text-lg">
                {valuation.year} {valuation.make} {valuation.model}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-y-2 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Value</p>
                  <p className="font-semibold">${(valuation.estimatedValue || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p>{(valuation.mileage || 0).toLocaleString()} mi</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p>{valuation.condition || "Not specified"}</p>
                </div>
                {(valuation.confidenceScore || valuation.confidence_score) && (
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p>{valuation.confidenceScore || valuation.confidence_score}%</p>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => onDownloadPdf(valuation)}
              >
                <FileDown className="h-4 w-4" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
