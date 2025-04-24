import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Download } from 'lucide-react';
import { downloadPdf } from '@/utils/pdfGenerator';

export const VinDecoderForm = () => {
  const [vin, setVin] = useState('');
  const { vehicleInfo, isLoading, error, lookupVin } = useVinDecoder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vin) {
      await lookupVin(vin);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">VIN Decoder</CardTitle>
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
              {isLoading ? 'Decoding...' : 'Decode VIN'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {vehicleInfo && <VehicleInfoCard vehicleInfo={vehicleInfo} />}
    </div>
  );
};

interface VehicleInfoCardProps {
  vehicleInfo: DecodedVehicleInfo;
}

const VehicleInfoCard = ({ vehicleInfo }: VehicleInfoCardProps) => {
  const displayField = (value: string | number | null | undefined) => {
    if (value === undefined || value === null) return "Unknown";
    if (typeof value === 'string' && (
      value.trim() === '' || 
      value === 'N/A' || 
      value === 'Not Applicable' || 
      value === 'Not Available'
    )) {
      return "Unknown";
    }
    return value;
  };

  return (
    <Card className="mt-6 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Vehicle Information</CardTitle>
        <CardDescription>Details decoded from VIN: {vehicleInfo.vin}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Make</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.make)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Model</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.model)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Year</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.year)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Trim</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.trim)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Engine</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.engine)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Transmission</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.transmission)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Drivetrain</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.drivetrain)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Body Type</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.bodyType)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        <Button 
          onClick={() => downloadPdf(vehicleInfo)}
          variant="outline"
        >
          <Download className="mr-2" />
          Download Report
        </Button>
      </CardFooter>
    </Card>
  );
};
