import React, { useState } from 'react';
import { toast } from 'sonner';
import { Car, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { ZipCodeInput } from './form-parts/ZipCodeInput';
import { Card } from '@/components/ui/card';
import states from '@/components/premium/lookup/shared/states-data';
import ValuationFormActions from './form-parts/ValuationFormActions';

type RequiredInputs = {
  mileage: number;
  fuelType: string;
  zipCode: string;
  condition?: number;
  hasAccident?: string; // Changed from boolean to string
  accidentDescription?: string;
  transmissionType?: string;
  hasOpenRecall?: boolean;
  warrantyStatus?: string;
};

export default function PlateDecoderForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [plateNumber, setPlateNumber] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { fetchVehicleData } = usePlateLookup();

  const [additionalInfo, setAdditionalInfo] = useState<RequiredInputs>({
    mileage: 0,
    fuelType: '',
    zipCode: '',
    hasAccident: 'no', // Changed from false to 'no'
    accidentDescription: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plateNumber || !stateCode) {
      toast.error("Please enter both plate number and state.");
      return;
    }

    setIsFetching(true);
    setFetchError(null);

    try {
      const data = await fetchVehicleData(plateNumber, stateCode);
      setVehicleData(data);
      setShowAdditionalInfo(true);
      toast.success("Vehicle data found!");
    } catch (error: any) {
      console.error("Plate lookup error:", error);
      setFetchError(error.message || "Failed to fetch vehicle data.");
      toast.error(error.message || "Failed to fetch vehicle data.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleAdditionalInfoSubmit = () => {
    if (onSubmit && vehicleData) {
      const combinedData = {
        ...vehicleData,
        ...additionalInfo,
        identifierType: 'plate',
        licensePlate: plateNumber,
        state: stateCode
      };
      onSubmit(combinedData);
    }
  };

  // When showing the secondary form for additional details
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2>
          <Car className="mr-2 h-5 w-5 inline-block align-middle" />
          License Plate Lookup
        </h2>
      </CardHeader>
      <CardContent>
        {!showAdditionalInfo ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="plateNumber">License Plate</Label>
              <Input
                type="text"
                id="plateNumber"
                placeholder="Enter plate number"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                disabled={isFetching}
              />
            </div>
            <div>
              <Label htmlFor="stateCode">State</Label>
              <Select
                value={stateCode}
                onValueChange={(value) => setStateCode(value)}
                disabled={isFetching}
              >
                <SelectTrigger id="stateCode">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isFetching} className="w-full">
              {isFetching ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Vehicle
                </>
              )}
            </Button>
            {fetchError && (
              <div className="text-red-500 mt-2 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                {fetchError}
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Additional Vehicle Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  type="number"
                  id="mileage"
                  placeholder="Enter mileage"
                  value={additionalInfo.mileage}
                  onChange={(e) =>
                    setAdditionalInfo({
                      ...additionalInfo,
                      mileage: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={additionalInfo.fuelType}
                  onValueChange={(value) =>
                    setAdditionalInfo({ ...additionalInfo, fuelType: value })
                  }
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ZipCodeInput
              zipCode={additionalInfo.zipCode}
              setZipCode={(zip) =>
                setAdditionalInfo({ ...additionalInfo, zipCode: zip })
              }
            />
            <ValuationFormActions
              onContinue={handleAdditionalInfoSubmit}
              onBack={() => setShowAdditionalInfo(false)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
