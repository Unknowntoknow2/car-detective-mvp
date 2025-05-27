
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedVinLookup } from '@/components/lookup/UnifiedVinLookup';

const VinDecoderForm: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
  };

  const handleVehicleFound = (vehicle: any) => {
    setResult(vehicle);
  };

  const handleDownloadPdf = () => {
    console.log('Downloading PDF...');
    // Implement PDF download logic
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>VIN Decoder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="zip-input" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ZIP Code (Optional)
              </label>
              <Input
                id="zip-input"
                value={zipCode}
                onChange={handleZipCodeChange}
                placeholder="Enter ZIP code for regional pricing"
                maxLength={5}
                className="w-full"
              />
            </div>
            
            <UnifiedVinLookup 
              onVehicleFound={handleVehicleFound}
              showHeader={false}
            />
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Year:</strong> {result.year}</p>
              <p><strong>Make:</strong> {result.make}</p>
              <p><strong>Model:</strong> {result.model}</p>
              {result.trim && <p><strong>Trim:</strong> {result.trim}</p>}
            </div>
            
            <Button 
              onClick={handleDownloadPdf}
              className="mt-4"
            >
              Download PDF Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VinDecoderForm;
