
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';
import { useValuationContext } from '@/contexts/ValuationContext';
import type { ValuationInput } from '@/types/valuation';

export function RerunValuationButton() {
  const { valuationData, rerunValuation, isLoading } = useValuationContext();
  const [isRerunning, setIsRerunning] = useState(false);

  const handleRerun = async () => {
    if (!valuationData) return;

    setIsRerunning(true);
    try {
      const input: ValuationInput = {
        vin: valuationData.vin || '',
        year: valuationData.vehicle.year,
        make: valuationData.vehicle.make,
        model: valuationData.vehicle.model,
        trim: valuationData.vehicle.trim,
        mileage: valuationData.mileage || 0,
        condition: 'good', // Default condition
        zipCode: valuationData.zip,
        fuelType: valuationData.vehicle.fuelType as any
      };

      await rerunValuation(input);
    } finally {
      setIsRerunning(false);
    }
  };

  const isRealtimeEngine = valuationData?.sources?.includes('openai_search') || 
                          valuationData?.marketSearchStatus === 'success';
  const showButton = !isRealtimeEngine && valuationData;

  if (!showButton) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm border border-orange-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-sm font-medium text-orange-700">
              Legacy Data Detected
            </p>
            <p className="text-xs text-orange-600">
              {valuationData?.confidenceScore}% confidence • No market listings
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleRerun}
          disabled={isLoading || isRerunning}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isRerunning ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 mr-2" />
          )}
          {isRerunning ? 'Running Real-Time Search...' : 'Rerun with Enhanced Engine'}
        </Button>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Get real market data & accurate pricing
        </p>
      </div>
    </div>
  );
}
