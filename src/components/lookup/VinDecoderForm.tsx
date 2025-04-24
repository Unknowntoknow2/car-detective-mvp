
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { useSaveValuation } from '@/hooks/useSaveValuation';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleInfoCard } from './VehicleInfoCard';
import { VinLookupForm } from './vin/VinLookupForm';
import { getCarfaxReport } from '@/utils/carfax/mockCarfaxService';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

export const VinDecoderForm = () => {
  const [vin, setVin] = useState('');
  const { vehicleInfo, isLoading, error, lookupVin } = useVinDecoder();
  const { saveValuation, isSaving } = useSaveValuation();
  const { user } = useAuth();
  const [carfaxData, setCarfaxData] = useState(null);
  const [isLoadingCarfax, setIsLoadingCarfax] = useState(false);
  const [carfaxError, setCarfaxError] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vin) {
      setCarfaxData(null);
      setCarfaxError(null);
      await lookupVin(vin);
      
      // Fetch CARFAX data after VIN lookup succeeds
      try {
        setIsLoadingCarfax(true);
        const carfaxReport = await getCarfaxReport(vin);
        setCarfaxData(carfaxReport);
        setIsLoadingCarfax(false);
      } catch (err) {
        console.error('Error fetching CARFAX data:', err);
        setCarfaxError('Unable to retrieve vehicle history report.');
        setIsLoadingCarfax(false);
        toast.error('Could not retrieve vehicle history report.');
      }
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
      confidenceScore: carfaxData ? 92 : 85,
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
      confidenceScore: carfaxData ? 92 : 85,
      adjustments: [
        { label: "Mileage", value: -3.5 },
        { label: "Condition", value: 2.0 },
        { label: "Market Demand", value: 4.0 },
        ...(carfaxData && carfaxData.accidentsReported > 0 ? [{ label: "Accident History", value: -3.0 }] : [])
      ],
      carfaxData: carfaxData // Pass CARFAX data to PDF generator
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
            isLoading={isLoading || isLoadingCarfax}
            onVinChange={setVin}
            onSubmit={handleSubmit}
          />
          
          {carfaxError && !isLoadingCarfax && (
            <div className="mt-4 p-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{carfaxError} This doesn't affect the vehicle details lookup.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {vehicleInfo && (
        <VehicleInfoCard 
          vehicleInfo={vehicleInfo} 
          onDownloadPdf={handleDownloadPdf}
          onSaveValuation={handleSaveValuation}
          isSaving={isSaving}
          isUserLoggedIn={!!user}
          carfaxData={carfaxData}
        />
      )}
    </div>
  );
};
