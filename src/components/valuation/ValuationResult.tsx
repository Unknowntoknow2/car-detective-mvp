
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { ValuationHeader } from './valuation-complete/ValuationHeader';
import { NextStepsCard } from './valuation-complete/NextStepsCard';
import { ValuationFactorsGrid } from './condition/factors/ValuationFactorsGrid';
import { ConditionValues } from './condition/types';
import { toast } from 'sonner';

interface ValuationResultProps {
  valuationId?: string;
  data?: any;
  isPremium?: boolean;
  isLoading?: boolean;
  error?: string;
}

export default function ValuationResult({
  valuationId,
  data,
  isPremium = false,
  isLoading = false,
  error
}: ValuationResultProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const resultId = valuationId || id;
  
  const [conditionValues, setConditionValues] = useState<ConditionValues>({
    accidents: 0,
    mileage: 0,
    year: 0,
    titleStatus: 'Clean'
  });
  
  useEffect(() => {
    if (data) {
      // Map valuation data to condition values if available
      setConditionValues({
        accidents: data.accidents || 0,
        mileage: data.mileage || 0,
        year: data.year || 0,
        titleStatus: data.titleStatus || 'Clean',
        overall: data.conditionScore || 80,
        exteriorGrade: data.exteriorGrade || 'Good',
        interiorGrade: data.interiorGrade || 'Good',
        mechanicalGrade: data.mechanicalGrade || 'Good',
        tireCondition: data.tireCondition || 'Good'
      });
    }
  }, [data]);
  
  const handleConditionChange = (id: string, value: any) => {
    setConditionValues(prev => ({
      ...prev,
      [id]: value
    }));
    
    // In a real application, this would trigger a revaluation with the new condition
    toast.info("Vehicle condition updated. Recalculating valuation...");
    // This would make an API call to update the valuation
    setTimeout(() => {
      toast.success("Valuation updated based on new condition factors.");
    }, 1500);
  };
  
  const handleShareValuation = () => {
    // Implement share functionality
    toast.info("Share functionality would open here");
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading valuation data...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card className="p-6 bg-red-50">
          <CardContent className="p-0">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-2">
                  Error Loading Valuation
                </h2>
                <p className="text-red-600">
                  {error || "Could not load valuation data. Please try again or contact support."}
                </p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/free')}
                >
                  Start New Valuation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If no data provided, render placeholder
  if (!data && !resultId) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card className="p-6">
          <CardContent className="p-0 text-center">
            <h2 className="text-xl font-bold mb-4">No Valuation Data</h2>
            <p className="text-muted-foreground mb-6">
              There is no valuation data to display. Please start a new valuation.
            </p>
            <Button onClick={() => navigate('/free')}>
              Start New Valuation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Get values from data or use defaults
  const {
    make = 'Unknown',
    model = 'Unknown',
    year = new Date().getFullYear(),
    mileage = 0,
    condition = 'Good',
    estimatedValue = 0,
    fuelType,
    transmission
  } = data || {};
  
  // Additional info for badge display
  const additionalInfo: Record<string, string> = {};
  if (fuelType) additionalInfo.fuelType = fuelType;
  if (transmission) additionalInfo.transmission = transmission;
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <ValuationHeader
        make={make}
        model={model}
        year={year}
        mileage={mileage}
        condition={condition}
        estimatedValue={estimatedValue}
        isPremium={isPremium}
        additionalInfo={additionalInfo}
      />
      
      {/* Condition Factors Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Condition Factors</h2>
        <ValuationFactorsGrid 
          values={conditionValues}
          onChange={handleConditionChange}
        />
      </div>
      
      {/* Next Steps Section */}
      {resultId && (
        <NextStepsCard
          valuationId={resultId}
          onShareClick={handleShareValuation}
          isPremium={isPremium}
        />
      )}
    </div>
  );
}

// Also export as a named export for compatibility
export { ValuationResult };
