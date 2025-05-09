
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Share, Download, Star } from 'lucide-react';

interface ValuationHeaderProps {
  valuationData: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    mileage?: number;
    vin?: string;
    estimatedValue?: number;
    condition?: string;
  };
  photoSubmitted: boolean;
  photoScore: number | null;
  aiCondition: any | null;
  estimatedValue: number | undefined;
  calculationInProgress: boolean;
  onShareValuation: () => void;
  onSaveToAccount: () => void;
  isSaving: boolean;
  bestPhotoUrl?: string;
}

export function ValuationHeader({
  valuationData,
  photoSubmitted,
  photoScore,
  aiCondition,
  estimatedValue,
  calculationInProgress,
  onShareValuation,
  onSaveToAccount,
  isSaving,
  bestPhotoUrl
}: ValuationHeaderProps) {
  const vehicleName = `${valuationData.year} ${valuationData.make} ${valuationData.model}`;
  const vehicleSpecs = valuationData.mileage 
    ? `${valuationData.mileage.toLocaleString()} miles • ${aiCondition?.condition || valuationData.condition || 'Good'} condition`
    : `${aiCondition?.condition || valuationData.condition || 'Good'} condition`;
  
  const confidenceScore = photoSubmitted ? 92 : 85;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">{vehicleName}</h1>
          {vehicleSpecs && <p className="text-gray-600">{vehicleSpecs}</p>}
        </div>
        
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {calculationInProgress 
              ? <span className="text-gray-400">Calculating...</span>
              : estimatedValue 
                ? `$${estimatedValue.toLocaleString()}`
                : '$0'
            }
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {confidenceScore}% confidence
          </div>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onShareValuation}
        >
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onSaveToAccount}
          disabled={isSaving}
        >
          <Download className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          <span>Favorite</span>
        </Button>
      </div>
    </div>
  );
}
