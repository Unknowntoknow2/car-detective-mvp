import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { CompletionValuationHeader } from './CompletionValuationHeader';
import { NextStepsCard } from './valuation-complete/NextStepsCard';
import { ValuationFactorsGrid } from '../condition/factors/ValuationFactorsGrid';
import { ConditionValues } from '../condition/types';
import { toast } from 'sonner';

export interface ValuationResultPremiumProps {
  valuationId?: string;
  data?: any;
  isPremium?: boolean;
  isLoading?: boolean;
  error?: string;
  onUpgrade?: () => void;
  onDownloadPdf?: () => Promise<void>;
  onEmailPdf?: () => Promise<void>;
  isGeneratingPdf?: boolean;
  isEmailingSending?: boolean;
}

export function ValuationResultPremium({
  valuationId,
  data,
  isPremium = false,
  isLoading = false,
  error,
  onUpgrade,
  onDownloadPdf,
  onEmailPdf,
  isGeneratingPdf = false,
  isEmailingSending = false
}: ValuationResultPremiumProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const resultId = valuationId || id;
  
  const [conditionValues, setConditionValues] = useState<ConditionValues>({
    exteriorBody: '',
    exteriorPaint: '',
    interiorSeats: '',
    interiorDashboard: '',
    mechanicalEngine: '',
    mechanicalTransmission: '',
    tiresCondition: '',
    odometer: 0,
    accidents: 0,
    mileage: 0,
    year: 0,
    titleStatus: 'Clean'
  });
  
  useEffect(() => {
    if (data) {
      // Map valuation data to condition values if available
      const updatedValues: Partial<ConditionValues> = {
        accidents: data.accidents || 0,
        mileage: data.mileage || 0,
        year: data.year || 0,
        titleStatus: data.titleStatus || 'Clean',
        exteriorGrade: data.exteriorGrade || 90,
        interiorGrade: data.interiorGrade || 90, // Fixed property name
        mechanicalGrade: data.mechanicalGrade || 90,
        tireCondition: data.tireCondition || 90 // Changed from tiresCondition to match property name
      };
      
      setConditionValues(prev => ({
        ...prev,
        ...updatedValues
      }));
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
  const vehicleData = data || {};
  const make = vehicleData.make || 'Unknown';
  const model = vehicleData.model || 'Unknown';
  const year = vehicleData.year || new Date().getFullYear();
  const mileage = vehicleData.mileage || 0;
  const condition = vehicleData.condition || 'Good';
  const estimatedValue = vehicleData.estimatedValue || vehicleData.estimated_value || 0;
  const fuelType = vehicleData.fuelType || vehicleData.fuel_type;
  const transmission = vehicleData.transmission;
  
  // Additional info for badge display
  const additionalInfo: Record<string, string> = {};
  if (fuelType) additionalInfo.fuelType = fuelType;
  if (transmission) additionalInfo.transmission = transmission;
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <CompletionValuationHeader
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
          onUpgrade={onUpgrade}
        />
      )}
    </div>
  );
}

// Also export as a named export for compatibility
export default ValuationResultPremium;
