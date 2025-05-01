
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateVIN } from '@/utils/validation/vin-validation';
import { VpicVinLookup } from '@/components/valuation/VpicVinLookup';

export default function VpicDecoderPage() {
  const [vin, setVin] = useState('');
  const [submittedVin, setSubmittedVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateVIN(vin);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN');
      return;
    }
    
    setError(null);
    setSubmittedVin(vin);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">NHTSA vPIC Decoder</h1>
          <p className="text-center text-muted-foreground mb-8">
            Decode your vehicle's information using the National Highway Traffic Safety Administration's vPIC database.
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Vehicle VIN</CardTitle>
              <CardDescription>
                Enter a valid 17-character Vehicle Identification Number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder="Enter VIN (e.g., 1HGCM82633A004352)"
                    className="font-mono"
                    maxLength={17}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
                <Button type="submit" disabled={vin.length !== 17}>
                  Decode VIN
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {submittedVin && (
            <VpicVinLookup vin={submittedVin} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
