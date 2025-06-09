
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Search, Loader2, Info } from 'lucide-react';
import { validateVIN } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';
import { decodeVin } from '@/services/vehicleDecodeService';

export default function VinDecoderForm() {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleVinChange = (value: string) => {
    const upperVin = value.toUpperCase();
    setVin(upperVin);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 VinDecoderForm: Starting VIN decode for:', vin);
    
    // Validate VIN format
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      toast.error('Invalid VIN format');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Decode the VIN
      const result = await decodeVin(vin);
      
      if (result.success && result.decoded) {
        console.log('✅ VIN decoded successfully:', result.decoded);
        toast.success('Vehicle found! Redirecting to valuation...');
        
        // Navigate to the valuation page with the VIN
        navigate(`/valuation/${vin}`);
      } else {
        console.error('❌ VIN decode failed:', result.error);
        setError(result.error || 'Failed to decode VIN');
        toast.error(result.error || 'Failed to decode VIN');
      }
    } catch (error: any) {
      console.error('❌ VIN lookup error:', error);
      setError('Failed to lookup VIN. Please try again.');
      toast.error('Failed to lookup VIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidLength = vin.length === 17;
  const hasValidFormat = /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="vin-input" className="text-sm font-medium">
            Vehicle Identification Number (VIN)
          </Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            Find your VIN on your dashboard, driver's side door, or vehicle registration
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="vin-input"
              type="text"
              placeholder="Enter 17-character VIN"
              value={vin}
              onChange={(e) => handleVinChange(e.target.value)}
              maxLength={17}
              className={`font-mono ${error ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{vin.length}/17 characters</span>
              <span>VIN format: letters and numbers only (no I, O, Q)</span>
            </div>
            
            {error && (
              <div className="flex items-start gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {vin && !hasValidFormat && vin.length === 17 && (
              <div className="flex items-start gap-2 text-orange-500 text-sm">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>VIN contains invalid characters (I, O, Q not allowed)</span>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!isValidLength || !hasValidFormat || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finding Car...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Find Car
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
