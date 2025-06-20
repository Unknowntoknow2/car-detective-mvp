
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Car, FileText, Loader2 } from 'lucide-react';
import { useValuation } from '@/contexts/ValuationContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function UnifiedLookupTabs() {
  const [vin, setVin] = useState('');
  const [isVinLoading, setIsVinLoading] = useState(false);
  const { processVinLookup } = useValuation();
  const navigate = useNavigate();

  const validateVin = (vin: string) => {
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  };

  const handleVinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateVin(vin)) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    setIsVinLoading(true);
    
    try {
      // Mock VIN decode for now - in production this would call a real VIN decode API
      const mockDecodedData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        trim: 'LE',
        bodyType: 'Sedan',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        color: 'Silver'
      };

      toast.success('VIN decoded successfully!');
      
      const result = await processVinLookup(vin, mockDecodedData);
      
      // Navigate to results page
      navigate(`/results/${result.valuationId}`);
      
    } catch (error) {
      console.error('VIN lookup error:', error);
      toast.error('Failed to process VIN lookup. Please try again.');
    } finally {
      setIsVinLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="vin" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vin" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            VIN Lookup
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="plate" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            License Plate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vin">
          <Card>
            <CardHeader>
              <CardTitle>VIN Lookup</CardTitle>
              <p className="text-muted-foreground">
                Enter your vehicle's 17-character VIN for instant valuation
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVinSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
                  <Input
                    id="vin"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder="Enter 17-character VIN"
                    maxLength={17}
                    className="font-mono"
                  />
                  {vin && !validateVin(vin) && (
                    <p className="text-sm text-red-500 mt-1">
                      VIN must be 17 characters (no I, O, or Q)
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  disabled={!validateVin(vin) || isVinLoading}
                  className="w-full"
                >
                  {isVinLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing VIN...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Get Valuation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <p className="text-muted-foreground">
                Enter vehicle details manually if you don't have the VIN
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Manual entry form coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plate">
          <Card>
            <CardHeader>
              <CardTitle>License Plate Lookup</CardTitle>
              <p className="text-muted-foreground">
                Get vehicle information using license plate number
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                License plate lookup coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
