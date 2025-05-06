import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { US_STATES } from '@/components/premium/lookup/shared/states-data';
import { ValuationFormActions } from '@/components/lookup/form-parts/ValuationFormActions';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { PlateLookupInfo } from '@/types/lookup';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PlateDecoderFormProps {
  onLookupComplete?: (result: PlateLookupInfo | null) => void;
  onDownloadPdf?: () => void;
  isDownloading?: boolean;
  onManualEntryClick?: () => void; // Add this prop to the interface
}

const PlateDecoderForm: React.FC<PlateDecoderFormProps> = ({ 
  onLookupComplete,
  onDownloadPdf,
  isDownloading = false,
  onManualEntryClick // Add this prop to the component parameters
}) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [state, setState] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const {
    lookupVehicle,
    isLoading,
    error,
    result
  } = usePlateLookup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plateNumber.trim() || !state) {
      return;
    }
    
    setSubmitted(true);
    const lookupResult = await lookupVehicle(plateNumber, state);
    
    if (onLookupComplete) {
      onLookupComplete(lookupResult);
    }
  };

  // Create a wrapper function for the form submission
  const onFormSubmit = () => {
    // Create a synthetic event
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(syntheticEvent);
  };

  // Create a wrapper function for the download action
  const handleDownloadClick = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    }
  };

  const isFormValid = plateNumber.trim() && state;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle>License Plate Decoder</CardTitle>
        <CardDescription>Enter a license plate number and state to get vehicle information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="plate-number">License Plate</Label>
              <Input
                id="plate-number"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="Enter license plate"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={state}
                onValueChange={setState}
                disabled={isLoading}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {result && (
            <div className="bg-primary/5 p-4 rounded-lg space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-lg">Vehicle Found</h3>
                  <p className="text-gray-700">
                    {result.year} {result.make} {result.model}
                    {result.trim && ` ${result.trim}`}
                  </p>
                  {result.color && (
                    <p className="text-sm text-gray-600">Color: {result.color}</p>
                  )}
                  {result.vin && (
                    <p className="text-sm text-gray-600">VIN: {result.vin}</p>
                  )}
                  {result.registeredState && (
                    <p className="text-sm text-gray-600">Registered in: {result.registeredState}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <ValuationFormActions
            isLoading={isLoading}
            submitButtonText="Lookup License Plate"
            onSubmit={onFormSubmit}
            showDownload={!!result}
            onDownloadPdf={handleDownloadClick}
            isDownloading={isDownloading}
            onManualEntryClick={onManualEntryClick} // Add the prop to ValuationFormActions if needed
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default PlateDecoderForm;
