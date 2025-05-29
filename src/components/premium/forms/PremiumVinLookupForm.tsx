import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { decodeVin } from '@/services/vinService';
import { Loader2, Car } from 'lucide-react';

interface PremiumVinLookupFormProps {
  vin?: string;
  setVin?: (vin: string) => void;
  onSubmit?: () => void;
}

export default function PremiumVinLookupForm({ vin: externalVin, setVin: externalSetVin, onSubmit: externalOnSubmit }: PremiumVinLookupFormProps) {
  const [internalVin, setInternalVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Use external state if provided, otherwise use internal state
  const vin = externalVin !== undefined ? externalVin : internalVin;
  const setVin = externalSetVin || setInternalVin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vin || vin.length !== 17) {
      toast({
        title: "Invalid VIN",
        description: "Please enter a valid 17-character VIN",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // If external onSubmit is provided, use it
      if (externalOnSubmit) {
        externalOnSubmit();
        return;
      }

      // Otherwise, use the internal VIN decoding logic
      const result = await decodeVin(vin);
      
      if (result.success && result.data) {
        toast({
          title: "VIN Decoded Successfully",
          description: `Found ${result.data.year} ${result.data.make} ${result.data.model}`,
        });
        
        // Navigate to premium valuation results or next step
        console.log('Premium VIN lookup result:', result.data);
      } else {
        toast({
          title: "VIN Decode Failed",
          description: result.error || "Could not decode the provided VIN",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Premium VIN lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "An error occurred while processing your VIN",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Premium VIN Lookup
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your 17-character VIN for comprehensive vehicle analysis with CARFAX data, auction comparisons, and AI-powered insights.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              type="text"
              placeholder="Enter 17-character VIN"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              maxLength={17}
              className="font-mono text-lg"
            />
            <p className="text-xs text-muted-foreground">
              The VIN is typically located on your dashboard, driver's side door, or vehicle registration.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Premium Features Include:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• CARFAX vehicle history report</li>
              <li>• Real-time auction data analysis</li>
              <li>• AI-powered condition assessment</li>
              <li>• Market trend predictions</li>
              <li>• Comprehensive valuation breakdown</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || vin.length !== 17}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing VIN...
              </>
            ) : (
              'Get Premium Valuation'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
