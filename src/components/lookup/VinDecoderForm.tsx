
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { downloadPdf } from '@/utils/pdfGenerator';
import { useSaveValuation } from '@/hooks/useSaveValuation';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleInfoCard } from './VehicleInfoCard';

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="vin" className="text-sm font-medium">
                VIN (17 characters)
              </label>
              <Input
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="e.g. 1HGCM82633A004352"
                maxLength={17}
                className="uppercase"
                pattern="[A-HJ-NPR-Z0-9]{17}"
                title="VIN must be 17 characters and contain only alphanumeric characters (excluding I, O, Q)"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter a 17-character VIN to decode vehicle information
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || vin.length !== 17}>
              {isLoading ? 'Looking Up...' : 'Lookup VIN'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {vehicleInfo && (
        <VehicleInfoCard 
          vehicleInfo={vehicleInfo} 
          onDownloadPdf={() => downloadPdf(vehicleInfo)}
          onSaveValuation={handleSaveValuation}
          isSaving={isSaving}
          isUserLoggedIn={!!user}
        />
      )}
    </div>
  );
};
