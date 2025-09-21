
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUnifiedLookup } from '@/hooks/useUnifiedLookup';
import { logger } from '@/lib/logger';
import { valuationLogger } from '@/utils/valuationLogger';
import { fetchVehicleByVin } from '@/services/vehicleLookupService';

export function UnifiedLookupTabs() {
  console.log('🔍 UnifiedLookupTabs rendering - checking for errors...');
  
  const [vin, setVin] = useState('');
  
  // Plate lookup states
  const [plateData, setPlateData] = useState({
    plate: '',
    state: ''
  });
  
  const navigate = useNavigate();
  
  // Use the real unified lookup service for plates only, direct service for VIN
  const { 
    isLoading: isUnifiedLoading, 
    lookupByPlate
  } = useUnifiedLookup({ mode: 'vpic', tier: 'free' });

  const [isVinLoading, setIsVinLoading] = useState(false);

  const validateVin = (vin: string) => {
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  };

  const handleVinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateVin(vin)) {
      valuationLogger.vinLookup(vin, 'validation-failed', { reason: 'invalid-format' }, false, 'Invalid VIN format');
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    valuationLogger.vinLookup(vin, 'decode-start', { vin }, true);
    setIsVinLoading(true);
    
    try {
      // CRITICAL FIX: Use vehicleLookupService that calls unified-decode edge function and saves to DB
      const vehicleInfo = await fetchVehicleByVin(vin);
      
      if (vehicleInfo) {
        valuationLogger.vinLookup(vin, 'decode-success', { 
          vehicle: vehicleInfo,
          navigateTo: '/valuation/followup'
        }, true);
        
        // Navigate to follow-up questions with decoded vehicle data
        const params = new URLSearchParams({
          year: vehicleInfo.year.toString(),
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          trim: vehicleInfo.trim || '',
          vin: vin,
          engine: vehicleInfo.engine || '',
          transmission: vehicleInfo.transmission || '',
          bodyType: vehicleInfo.bodyType || '',
          fuelType: vehicleInfo.fuelType || '',
          drivetrain: vehicleInfo.drivetrain || '',
          source: 'vin'
        });
        
        toast.success('VIN decoded successfully!');
        navigate(`/valuation/followup?${params.toString()}`);
        
      } else {
        valuationLogger.vinLookup(vin, 'decode-failed', { error: 'No vehicle data returned' }, false, 'No vehicle data returned');
        toast.error('Failed to decode VIN. Please check the VIN and try again.');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      valuationLogger.vinLookup(vin, 'service-error', { error: errorMessage }, false, errorMessage);
      toast.error('VIN lookup service temporarily unavailable. Please try again.');
    } finally {
      setIsVinLoading(false);
    }
  };


  const handlePlateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plateData.plate || !plateData.state) {
      toast.error('Please enter both plate number and state');
      return;
    }

    logger.log('🏷️ Plate Lookup: Processing license plate lookup');
    
    try {
      const result = await lookupByPlate(plateData.plate, plateData.state);
      
      if (result && result.success && result.vehicle) {
        logger.log('✅ Plate Lookup: Successfully found vehicle:', result.vehicle);
        
        // Navigate to follow-up questions with vehicle data INCLUDING plate info
        const params = new URLSearchParams({
          year: result.vehicle.year.toString(),
          make: result.vehicle.make,
          model: result.vehicle.model,
          trim: result.vehicle.trim || '',
          plate: plateData.plate,
          state: plateData.state,
          vin: result.vehicle.vin || `PLATE_${plateData.plate}_${plateData.state}`, // Generate placeholder VIN for plates
          engine: result.vehicle.engine || '',
          transmission: result.vehicle.transmission || '',
          bodyType: result.vehicle.bodyType || '',
          fuelType: result.vehicle.fuelType || '',
          drivetrain: result.vehicle.drivetrain || '',
          source: 'plate'
        });
        
        toast.success('License plate lookup completed!');
        navigate(`/valuation/followup?${params.toString()}`);
        
      } else {
        toast.error('Failed to find vehicle by license plate. Please try VIN lookup.');
      }
      
    } catch (error) {
      toast.error('Plate lookup service temporarily unavailable. Please try again.');
    }
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="vin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vin" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            VIN Lookup
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
                Enter your vehicle's 17-character VIN for instant identification using real NHTSA data
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVinSubmit} className="space-y-4">
                <div className="space-y-4">
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

                </div>
                <Button 
                  type="submit" 
                  disabled={!validateVin(vin) || isVinLoading}
                  className="w-full"
                >
                  {isVinLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Decoding VIN with NHTSA...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Get Vehicle Information
                    </>
                  )}
                </Button>
              </form>
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
              <form onSubmit={handlePlateSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="plate">License Plate Number *</Label>
                  <Input
                    id="plate"
                    value={plateData.plate}
                    onChange={(e) => setPlateData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                    placeholder="Enter license plate"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={plateData.state} onValueChange={(value) => setPlateData(prev => ({ ...prev, state: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  disabled={!plateData.plate || !plateData.state || isUnifiedLoading}
                  className="w-full"
                >
                  {isUnifiedLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Looking up plate...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Get Vehicle Information
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
