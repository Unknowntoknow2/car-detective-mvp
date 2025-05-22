
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { validateVIN } from '@/utils/validation/vin-validation';

const VinDecoderForm = () => {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate VIN
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format. Please check and try again.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Store VIN in localStorage for follow-up steps
      localStorage.setItem('current_vin', vin);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to follow-up page
      navigate(`/valuation-followup?vin=${vin}`);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin">Enter Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              placeholder="Example: 1HGCM82633A004352"
              value={vin}
              onChange={(e) => {
                setVin(e.target.value.toUpperCase());
                if (error) setError(null);
              }}
              className="uppercase"
              maxLength={17}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Lookup VIN'
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground mt-2">
            The VIN is a 17-character identifier unique to your vehicle. It can be found on your vehicle registration, insurance card, or on the driver's side dashboard.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default VinDecoderForm;
