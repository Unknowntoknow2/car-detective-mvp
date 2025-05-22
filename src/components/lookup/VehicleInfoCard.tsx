
import React, { useEffect, useState } from 'react';
import type { DecodedVehicleInfo } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Download, BookmarkPlus, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { VehicleDetailsGrid } from './VehicleDetailsGrid';
import { VehicleScoring } from './VehicleScoring';
import { ForecastChart } from './forecast/ForecastChart';
import { CarfaxSummary } from './CarfaxSummary';
import { VehicleHistory } from './VehicleHistory';
import { CarfaxData } from '@/utils/carfax/mockCarfaxService';
import { useSaveValuation } from '@/hooks/useSaveValuation';
import { MarketingBanner } from '@/components/marketing/MarketingBanner';
import { useAICondition } from '@/hooks/useAICondition';

interface VehicleInfoCardProps {
  vehicleInfo: DecodedVehicleInfo;
  onDownloadPdf: () => void;
  carfaxData?: CarfaxData;
}

export const VehicleInfoCard = ({ 
  vehicleInfo, 
  onDownloadPdf, 
  carfaxData 
}: VehicleInfoCardProps) => {
  const basePrice = 24500;
  const { saveValuation, isSaving } = useSaveValuation();
  const { conditionData } = useAICondition(vehicleInfo.vin);

  const handleSaveValuation = () => {
    saveValuation({
      vin: vehicleInfo.vin || '',
      make: vehicleInfo.make,
      model: vehicleInfo.model,
      year: vehicleInfo.year,
      valuation: basePrice,
      confidenceScore: carfaxData ? 92 : 85,
      conditionScore: conditionData?.confidenceScore || 75,
      is_vin_lookup: true
    });
  };

  return (
    <Card className="mt-6 border-2 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Vehicle Information</CardTitle>
            <CardDescription>Details found for VIN: {vehicleInfo.vin || 'Unknown'}</CardDescription>
          </div>
          
          {carfaxData && (
            <div className="flex items-center gap-2">
              {carfaxData.accidentsReported > 0 || carfaxData.salvageTitle ? (
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">History Issues</span>
                </div>
              ) : (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Clean History</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <VehicleDetailsGrid vehicleInfo={vehicleInfo} />
        
        {!carfaxData && (
          <div className="my-6">
            <MarketingBanner 
              headline="Want the complete CARFAX® history report?"
              subtext="Upgrade to Premium and get full vehicle history, accident details, service records, and more."
              ctaText="Get Premium with CARFAX®"
              ctaHref="/premium"
            />
          </div>
        )}
        
        {carfaxData && <CarfaxSummary carfaxData={carfaxData} />}
        
        <VehicleHistory 
          vin={vehicleInfo.vin || ''} 
          valuationId={vehicleInfo.vin || ''}
        />
        
        <div className="mt-8 pt-6 border-t border-border/60">
          <h3 className="text-lg font-semibold mb-4">Valuation & Scoring</h3>
          <VehicleScoring 
            baseValue={basePrice}
            valuationBreakdown={[
              {
                factor: "Mileage",
                impact: -3.5,
                description: "Vehicle has higher mileage than average (76,000 mi vs. market avg of 65,000 mi)"
              },
              {
                factor: "Condition",
                impact: 2.0,
                description: "Vehicle condition is above average based on service history and reported condition"
              },
              {
                factor: "Market Demand",
                impact: 4.0,
                description: "This model currently has high demand in your region (based on 30-day sales data)"
              },
              ...(carfaxData && carfaxData.accidentsReported > 0 ? [{
                factor: "Accident History",
                impact: -3.0,
                description: `${carfaxData.accidentsReported} reported accident${carfaxData.accidentsReported > 1 ? 's' : ''} with ${carfaxData.damageSeverity || 'minor'} damage`
              }] : [])
            ]}
            confidenceScore={carfaxData ? 92 : 85}
            estimatedValue={basePrice}
            comparableVehicles={117}
          />
        </div>
        
        <div className="mt-8">
          <ForecastChart 
            valuationId={vehicleInfo.vin || ''}
            basePrice={basePrice}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button 
          onClick={onDownloadPdf}
          variant="outline"
        >
          <Download className="mr-2" />
          Download Report
        </Button>
        <Button 
          onClick={handleSaveValuation}
          disabled={isSaving}
          variant="secondary"
        >
          <BookmarkPlus className="mr-2" />
          {isSaving ? 'Saving...' : 'Save to Dashboard'}
        </Button>
      </CardFooter>
    </Card>
  );
};
