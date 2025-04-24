
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdfGenerator';
import { useSaveValuation } from '@/hooks/useSaveValuation';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleInfoCard } from './VehicleInfoCard';
import { VinLookupForm } from './vin/VinLookupForm';

export const VinDecoderForm = () => {
  const [vin, setVin] = useState('');
  const { vehicleInfo, isLoading, error, lookupVin } = useVinDecoder();
  const { saveValuation, isSaving } = useSaveValuation();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vin) {
      await lookupVin(vin);
    }
  };

  const handleSaveValuation = async () => {
    if (!vehicleInfo) return;

    const saved = await saveValuation({
      vin: vehicleInfo.vin,
      make: vehicleInfo.make,
      model: vehicleInfo.model,
      year: vehicleInfo.year,
      valuation: 24500,
      confidenceScore: 92,
      conditionScore: 85
    });
  };

  const handleDownloadPdf = () => {
    if (!vehicleInfo) return;
    
    const reportData = convertVehicleInfoToReportData(vehicleInfo, {
      mileage: 76000,
      estimatedValue: 24500,
      condition: "Good",
      zipCode: "10001",
      confidenceScore: 92,
      adjustments: [
        { label: "Mileage", value: -3.5 },
        { label: "Condition", value: 2.0 },
        { label: "Market Demand", value: 4.0 }
      ]
    });
    
    downloadPdf(reportData);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">VIN Lookup</CardTitle>
          <CardDescription>
            Enter a Vehicle Identification Number (VIN) to get detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VinLookupForm
            vin={vin}
            isLoading={isLoading}
            onVinChange={setVin}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      {vehicleInfo && (
        <VehicleInfoCard 
          vehicleInfo={vehicleInfo} 
          onDownloadPdf={handleDownloadPdf}
          onSaveValuation={handleSaveValuation}
          isSaving={isSaving}
          isUserLoggedIn={!!user}
        />
      )}
    </div>
  );
};
