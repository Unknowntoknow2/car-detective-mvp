
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { validateVIN } from '@/utils/validation/vin-validation';

export default function VpicDecoderPage() {
  const [vin, setVin] = useState('');
  const [decodedData, setDecodedData] = useState<any>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    setVin(newVin);
    setError(null);
  };

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      return;
    }
    
    setIsDecoding(true);
    setError(null);
    
    try {
      // Implementation would call a VIN decoding service
      // For now, just simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDecodedData({
        vehicleType: 'PASSENGER CAR',
        make: 'TOYOTA',
        model: 'CAMRY',
        year: 2020,
        plantCountry: 'UNITED STATES (USA)',
        series: 'LE',
        trim: 'Base',
        bodyStyle: 'Sedan',
        engine: '2.5L I4 16V MPFI DOHC',
        fuelType: 'GAS',
        transmission: 'CVT',
        drivetrain: 'FWD'
      });
    } catch (error) {
      console.error('Failed to decode VIN:', error);
      setError('Failed to decode VIN. Please try again.');
    } finally {
      setIsDecoding(false);
    }
  };

  const isValid = vin.length === 17 && validateVIN(vin).isValid;

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">VPIC VIN Decoder</h1>
        <p className="text-muted-foreground">
          Enter a Vehicle Identification Number (VIN) to decode it using the NHTSA VPIC API.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>VIN Lookup</CardTitle>
            <CardDescription>Enter a 17-character Vehicle Identification Number</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDecode} className="space-y-4">
              <div>
                <Input
                  placeholder="Enter 17-digit VIN"
                  value={vin}
                  onChange={handleVinChange}
                  className="font-mono"
                  maxLength={17}
                />
                {error && (
                  <p className="text-sm text-destructive mt-1">{error}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={!isValid || isDecoding}
                className="w-full"
              >
                {isDecoding ? 'Decoding...' : 'Decode VIN'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {decodedData && (
          <Card>
            <CardHeader>
              <CardTitle>Decoded Vehicle Information</CardTitle>
              <CardDescription>
                {decodedData.year} {decodedData.make} {decodedData.model}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(decodedData).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
