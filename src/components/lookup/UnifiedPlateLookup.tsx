
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usStates } from '@/data/states';
import { lookupPlate } from '@/services/plateService';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UnifiedPlateLookupProps {
  onSubmit?: (plate: string, state: string) => void;
  onVehicleFound?: (vehicle: DecodedVehicleInfo) => void;
  showHeader?: boolean;
  className?: string;
}

export const UnifiedPlateLookup: React.FC<UnifiedPlateLookupProps> = ({
  onSubmit,
  onVehicleFound,
  showHeader = false,
  className = ""
}) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate.trim() || !state) {
      setError('Please enter both license plate and state');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVehicle(null);

    try {
      console.log('🔍 Real plate lookup starting for:', plate, state);
      const result = await lookupPlate(plate, state);
      
      if (!result.make || !result.model || !result.year) {
        throw new Error('Incomplete vehicle data received from plate lookup');
      }

      console.log('✅ Real plate lookup successful:', result);
      setVehicle(result);
      
      // Store for follow-up steps
      localStorage.setItem('current_plate', plate);
      localStorage.setItem('current_state', state);
      
      toast.success(`Vehicle found: ${result.year} ${result.make} ${result.model}`);
      
      if (onSubmit) {
        onSubmit(plate, state);
      }
      
      if (onVehicleFound) {
        onVehicleFound(result);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'License plate lookup failed';
      console.error('❌ Plate lookup error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (vehicle) {
      navigate(`/valuation-followup?plate=${plate}&state=${state}`);
    }
  };

  return (
    <div className={className}>
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="text-center">License Plate Lookup</CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plate">License Plate</Label>
              <Input
                id="plate"
                value={plate}
                onChange={(e) => {
                  setPlate(e.target.value.toUpperCase());
                  if (error) setError(null);
                }}
                placeholder="Enter license plate"
                className="uppercase font-mono"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select 
                value={state} 
                onValueChange={(value) => {
                  setState(value);
                  if (error) setError(null);
                }}
                disabled={isLoading}
                required
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {usStates.map((stateOption) => (
                    <SelectItem key={stateOption.value} value={stateOption.value}>
                      {stateOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !plate || !state}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up plate...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Lookup License Plate
                </>
              )}
            </Button>
          </form>

          {vehicle && (
            <VehicleFoundCard 
              vehicle={vehicle}
              showActions={true}
              onContinue={handleContinue}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedPlateLookup;
