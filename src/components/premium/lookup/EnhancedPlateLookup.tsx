
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { Car, Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { states } from '@/components/premium/lookup/shared/states-data'; // Updated from US_STATES to states
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleFoundCard } from './plate/VehicleFoundCard';
import { ValuationErrorState } from './shared/ValuationErrorState';
import { ValuationStages } from './shared/ValuationStages';

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

export function EnhancedPlateLookup({ onComplete }: { onComplete: (data: any) => void }) {
  const [plateNumber, setPlateNumber] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [additionalInfo, setAdditionalInfo] = useState<RequiredInputs>({
    mileage: 0,
    fuelType: '',
    zipCode: '',
    hasAccident: 'no', // Changed from false to 'no'
    accidentDescription: '',
  });

  const { lookupVehicle } = usePlateLookup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate additional info
      if (!additionalInfo.mileage || !additionalInfo.fuelType || !additionalInfo.zipCode) {
        setSubmitError("Please fill in all additional information fields.");
        return;
      }

      // Combine vehicle data and additional info
      const combinedData = {
        ...vehicleData,
        ...additionalInfo,
        licensePlate: plateNumber,
        state: stateCode
      };

      // Pass the combined data to the onComplete callback
      onComplete(combinedData);
      setShowSuccess(true);
      toast.success("Valuation form completed successfully!");
    } catch (error: any) {
      console.error("Failed to submit valuation:", error);
      setSubmitError(error.message || "Failed to submit valuation. Please try again.");
      toast.error(submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchVehicle = async () => {
    setIsFetching(true);
    setFetchError(null);

    try {
      const data = await lookupVehicle(plateNumber, stateCode);
      if (!data) {
        throw new Error("Failed to fetch vehicle data");
      }
      setVehicleData(data);
      setShowAdditionalInfo(true);
      toast.success("Vehicle found! Please provide additional details.");
    } catch (error: any) {
      console.error("Failed to fetch vehicle:", error);
      setFetchError(error.message || "Failed to fetch vehicle. Please check the plate number and state.");
      toast.error(fetchError);
      setVehicleData(null);
      setShowAdditionalInfo(false);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Enhanced Plate Lookup</CardTitle>
        <Search className="ml-2 h-5 w-5 text-gray-500" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-4 gap-2">
          <Label htmlFor="plate" className="text-right flex items-center">
            Plate:
          </Label>
          <Input
            id="plate"
            className="col-span-3"
            placeholder="Enter plate number"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            disabled={isFetching}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Label htmlFor="state" className="text-right flex items-center">
            State:
          </Label>
          <Select onValueChange={setStateCode} defaultValue={stateCode}>
            <SelectTrigger id="state" className="col-span-3">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => ( // Changed from US_STATES to states
                <SelectItem key={state.value} value={state.value}>
                  {state.label} ({state.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleFetchVehicle} disabled={isFetching || !plateNumber || !stateCode}>
          {isFetching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching Vehicle...
            </>
          ) : (
            "Fetch Vehicle"
          )}
        </Button>
      </CardFooter>

      <AnimatePresence>
        {fetchError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <p>{fetchError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {vehicleData && showAdditionalInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <VehicleFoundCard vehicle={vehicleData} />
            <CardContent className="grid gap-4 mt-4">
              <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="mileage" className="text-right flex items-center">
                  Mileage:
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  className="col-span-3"
                  placeholder="Enter mileage"
                  value={additionalInfo.mileage}
                  onChange={(e) => setAdditionalInfo({ ...additionalInfo, mileage: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="fuelType" className="text-right flex items-center">
                  Fuel Type:
                </Label>
                <Select
                  onValueChange={(value) => setAdditionalInfo({ ...additionalInfo, fuelType: value })}
                  defaultValue={additionalInfo.fuelType}
                >
                  <SelectTrigger id="fuelType" className="col-span-3">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="zipCode" className="text-right flex items-center">
                  ZIP Code:
                </Label>
                <Input
                  id="zipCode"
                  type="number"
                  className="col-span-3"
                  placeholder="Enter ZIP code"
                  value={additionalInfo.zipCode}
                  onChange={(e) => setAdditionalInfo({ ...additionalInfo, zipCode: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="hasAccident" className="text-right flex items-center">
                  Accident History:
                </Label>
                <Select
                  onValueChange={(value) => setAdditionalInfo({ ...additionalInfo, hasAccident: value })}
                  defaultValue={additionalInfo.hasAccident}
                >
                  <SelectTrigger id="hasAccident" className="col-span-3">
                    <SelectValue placeholder="Select accident history" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Valuation"
                )}
              </Button>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-200"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <p>Valuation submitted successfully!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

