result.vehicle.vin || ''
result.vehicle.vin || ''import React, { useState } from 'react';
result.vehicle.vin || ''import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
result.vehicle.vin || ''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
result.vehicle.vin || ''import { Input } from '@/components/ui/input';
result.vehicle.vin || ''import { Button } from '@/components/ui/button';
result.vehicle.vin || ''import { Label } from '@/components/ui/label';
result.vehicle.vin || ''import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
result.vehicle.vin || ''import { Search, FileText, Loader2 } from 'lucide-react';
result.vehicle.vin || ''import { useNavigate } from 'react-router-dom';
result.vehicle.vin || ''import { toast } from 'sonner';
result.vehicle.vin || ''import { useUnifiedLookup } from '@/hooks/useUnifiedLookup';
result.vehicle.vin || ''import { logger } from '@/lib/logger';
result.vehicle.vin || ''import { valuationLogger } from '@/utils/valuationLogger';
result.vehicle.vin || ''import { fetchVehicleByVin } from '@/services/vehicleLookupService';
result.vehicle.vin || ''
result.vehicle.vin || ''export function UnifiedLookupTabs() {
result.vehicle.vin || ''  logger.log('🔍 UnifiedLookupTabs rendering v2.0 - FIXED - no context dependencies - ' + Date.now());
result.vehicle.vin || ''  const [vin, setVin] = useState('');
result.vehicle.vin || ''  
result.vehicle.vin || ''  // Plate lookup states
result.vehicle.vin || ''  const [plateData, setPlateData] = useState({
result.vehicle.vin || ''    plate: '',
result.vehicle.vin || ''    state: ''
result.vehicle.vin || ''  });
result.vehicle.vin || ''  
result.vehicle.vin || ''  const navigate = useNavigate();
result.vehicle.vin || ''  
result.vehicle.vin || ''  // Use the real unified lookup service for plates only, direct service for VIN
result.vehicle.vin || ''  const { 
result.vehicle.vin || ''    isLoading: isUnifiedLoading, 
result.vehicle.vin || ''    lookupByPlate
result.vehicle.vin || ''  } = useUnifiedLookup({ mode: 'vpic', tier: 'free' });
result.vehicle.vin || ''
result.vehicle.vin || ''  const [isVinLoading, setIsVinLoading] = useState(false);
result.vehicle.vin || ''
result.vehicle.vin || ''  const validateVin = (vin: string) => {
result.vehicle.vin || ''    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
result.vehicle.vin || ''  };
result.vehicle.vin || ''
result.vehicle.vin || ''  const handleVinSubmit = async (e: React.FormEvent) => {
result.vehicle.vin || ''    e.preventDefault();
result.vehicle.vin || ''    
result.vehicle.vin || ''    if (!validateVin(vin)) {
result.vehicle.vin || ''      valuationLogger.vinLookup(vin, 'validation-failed', { reason: 'invalid-format' }, false, 'Invalid VIN format');
result.vehicle.vin || ''      toast.error('Please enter a valid 17-character VIN');
result.vehicle.vin || ''      return;
result.vehicle.vin || ''    }
result.vehicle.vin || ''
result.vehicle.vin || ''    valuationLogger.vinLookup(vin, 'decode-start', { vin }, true);
result.vehicle.vin || ''    setIsVinLoading(true);
result.vehicle.vin || ''    
result.vehicle.vin || ''    try {
result.vehicle.vin || ''      // CRITICAL FIX: Use vehicleLookupService that calls unified-decode edge function and saves to DB
result.vehicle.vin || ''      const vehicleInfo = await fetchVehicleByVin(vin);
result.vehicle.vin || ''      
result.vehicle.vin || ''      if (vehicleInfo) {
result.vehicle.vin || ''        valuationLogger.vinLookup(vin, 'decode-success', { 
result.vehicle.vin || ''          vehicle: vehicleInfo,
result.vehicle.vin || ''          navigateTo: '/valuation/followup'
result.vehicle.vin || ''        }, true);
result.vehicle.vin || ''        
result.vehicle.vin || ''        // Navigate to follow-up questions with decoded vehicle data
result.vehicle.vin || ''        const params = new URLSearchParams({
result.vehicle.vin || ''          year: vehicleInfo.year.toString(),
result.vehicle.vin || ''          make: vehicleInfo.make,
result.vehicle.vin || ''          model: vehicleInfo.model,
result.vehicle.vin || ''          trim: vehicleInfo.trim || '',
result.vehicle.vin || ''          vin: vin,
result.vehicle.vin || ''          engine: vehicleInfo.engine || '',
result.vehicle.vin || ''          transmission: vehicleInfo.transmission || '',
result.vehicle.vin || ''          bodyType: vehicleInfo.bodyType || '',
result.vehicle.vin || ''          fuelType: vehicleInfo.fuelType || '',
result.vehicle.vin || ''          drivetrain: vehicleInfo.drivetrain || '',
result.vehicle.vin || ''          source: 'vin'
result.vehicle.vin || ''        });
result.vehicle.vin || ''        
result.vehicle.vin || ''        toast.success('VIN decoded successfully!');
result.vehicle.vin || ''        navigate(`/valuation/followup?${params.toString()}`);
result.vehicle.vin || ''        
result.vehicle.vin || ''      } else {
result.vehicle.vin || ''        valuationLogger.vinLookup(vin, 'decode-failed', { error: 'No vehicle data returned' }, false, 'No vehicle data returned');
result.vehicle.vin || ''        toast.error('Failed to decode VIN. Please check the VIN and try again.');
result.vehicle.vin || ''      }
result.vehicle.vin || ''      
result.vehicle.vin || ''    } catch (error) {
result.vehicle.vin || ''      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
result.vehicle.vin || ''      valuationLogger.vinLookup(vin, 'service-error', { error: errorMessage }, false, errorMessage);
result.vehicle.vin || ''      toast.error('VIN lookup service temporarily unavailable. Please try again.');
result.vehicle.vin || ''    } finally {
result.vehicle.vin || ''      setIsVinLoading(false);
result.vehicle.vin || ''    }
result.vehicle.vin || ''  };
result.vehicle.vin || ''
result.vehicle.vin || ''
result.vehicle.vin || ''  const handlePlateSubmit = async (e: React.FormEvent) => {
result.vehicle.vin || ''    e.preventDefault();
result.vehicle.vin || ''    
result.vehicle.vin || ''    if (!plateData.plate || !plateData.state) {
result.vehicle.vin || ''      toast.error('Please enter both plate number and state');
result.vehicle.vin || ''      return;
result.vehicle.vin || ''    }
result.vehicle.vin || ''
result.vehicle.vin || ''    logger.log('🏷️ Plate Lookup: Processing license plate lookup');
result.vehicle.vin || ''    
result.vehicle.vin || ''    try {
result.vehicle.vin || ''      const result = await lookupByPlate(plateData.plate, plateData.state);
result.vehicle.vin || ''      
result.vehicle.vin || ''      if (result && result.success && result.vehicle) {
result.vehicle.vin || ''        logger.log('✅ Plate Lookup: Successfully found vehicle:', result.vehicle);
result.vehicle.vin || ''        
result.vehicle.vin || ''        // Navigate to follow-up questions with vehicle data INCLUDING plate info
result.vehicle.vin || ''        const params = new URLSearchParams({
result.vehicle.vin || ''          year: result.vehicle.year.toString(),
result.vehicle.vin || ''          make: result.vehicle.make,
result.vehicle.vin || ''          model: result.vehicle.model,
result.vehicle.vin || ''          trim: result.vehicle.trim || '',
result.vehicle.vin || ''          plate: plateData.plate,
result.vehicle.vin || ''          state: plateData.state,
result.vehicle.vin || ''          vin: result.vehicle.vin || `PLATE_${plateData.plate}_${plateData.state}`, // Generate placeholder VIN for plates
result.vehicle.vin || ''          engine: result.vehicle.engine || '',
result.vehicle.vin || ''          transmission: result.vehicle.transmission || '',
result.vehicle.vin || ''          bodyType: result.vehicle.bodyType || '',
result.vehicle.vin || ''          fuelType: result.vehicle.fuelType || '',
result.vehicle.vin || ''          drivetrain: result.vehicle.drivetrain || '',
result.vehicle.vin || ''          source: 'plate'
result.vehicle.vin || ''        });
result.vehicle.vin || ''        
result.vehicle.vin || ''        toast.success('License plate lookup completed!');
result.vehicle.vin || ''        navigate(`/valuation/followup?${params.toString()}`);
result.vehicle.vin || ''        
result.vehicle.vin || ''      } else {
result.vehicle.vin || ''        console.error('❌ Plate Lookup: Failed:', result?.error);
result.vehicle.vin || ''        toast.error('Failed to find vehicle by license plate. Please try VIN lookup.');
result.vehicle.vin || ''      }
result.vehicle.vin || ''      
result.vehicle.vin || ''    } catch (error) {
result.vehicle.vin || ''      console.error('❌ Plate lookup error:', error);
result.vehicle.vin || ''      toast.error('Plate lookup service temporarily unavailable. Please try again.');
result.vehicle.vin || ''    }
result.vehicle.vin || ''  };
result.vehicle.vin || ''
result.vehicle.vin || ''  const states = [
result.vehicle.vin || ''    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
result.vehicle.vin || ''    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
result.vehicle.vin || ''    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
result.vehicle.vin || ''    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
result.vehicle.vin || ''    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
result.vehicle.vin || ''  ];
result.vehicle.vin || ''
result.vehicle.vin || ''  return (
result.vehicle.vin || ''    <div className="w-full max-w-4xl mx-auto">
result.vehicle.vin || ''      <Tabs defaultValue="vin" className="w-full">
result.vehicle.vin || ''        <TabsList className="grid w-full grid-cols-2">
result.vehicle.vin || ''          <TabsTrigger value="vin" className="flex items-center gap-2">
result.vehicle.vin || ''            <Search className="w-4 h-4" />
result.vehicle.vin || ''            VIN Lookup
result.vehicle.vin || ''          </TabsTrigger>
result.vehicle.vin || ''          <TabsTrigger value="plate" className="flex items-center gap-2">
result.vehicle.vin || ''            <FileText className="w-4 h-4" />
result.vehicle.vin || ''            License Plate
result.vehicle.vin || ''          </TabsTrigger>
result.vehicle.vin || ''        </TabsList>
result.vehicle.vin || ''
result.vehicle.vin || ''        <TabsContent value="vin">
result.vehicle.vin || ''          <Card>
result.vehicle.vin || ''            <CardHeader>
result.vehicle.vin || ''              <CardTitle>VIN Lookup</CardTitle>
result.vehicle.vin || ''              <p className="text-muted-foreground">
result.vehicle.vin || ''                Enter your vehicle's 17-character VIN for instant identification using real NHTSA data
result.vehicle.vin || ''              </p>
result.vehicle.vin || ''            </CardHeader>
result.vehicle.vin || ''            <CardContent>
result.vehicle.vin || ''              <form onSubmit={handleVinSubmit} className="space-y-4">
result.vehicle.vin || ''                <div className="space-y-4">
result.vehicle.vin || ''                  <div>
result.vehicle.vin || ''                    <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
result.vehicle.vin || ''                    <Input
result.vehicle.vin || ''                      id="vin"
result.vehicle.vin || ''                      value={vin}
result.vehicle.vin || ''                      onChange={(e) => setVin(e.target.value.toUpperCase())}
result.vehicle.vin || ''                      placeholder="Enter 17-character VIN"
result.vehicle.vin || ''                      maxLength={17}
result.vehicle.vin || ''                      className="font-mono"
result.vehicle.vin || ''                    />
result.vehicle.vin || ''                    {vin && !validateVin(vin) && (
result.vehicle.vin || ''                      <p className="text-sm text-red-500 mt-1">
result.vehicle.vin || ''                        VIN must be 17 characters (no I, O, or Q)
result.vehicle.vin || ''                      </p>
result.vehicle.vin || ''                    )}
result.vehicle.vin || ''                  </div>
result.vehicle.vin || ''
result.vehicle.vin || ''                </div>
result.vehicle.vin || ''                <Button 
result.vehicle.vin || ''                  type="submit" 
result.vehicle.vin || ''                  disabled={!validateVin(vin) || isVinLoading}
result.vehicle.vin || ''                  className="w-full"
result.vehicle.vin || ''                >
result.vehicle.vin || ''                  {isVinLoading ? (
result.vehicle.vin || ''                    <>
result.vehicle.vin || ''                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
result.vehicle.vin || ''                      Decoding VIN with NHTSA...
result.vehicle.vin || ''                    </>
result.vehicle.vin || ''                  ) : (
result.vehicle.vin || ''                    <>
result.vehicle.vin || ''                      <Search className="w-4 h-4 mr-2" />
result.vehicle.vin || ''                      Get Vehicle Information
result.vehicle.vin || ''                    </>
result.vehicle.vin || ''                  )}
result.vehicle.vin || ''                </Button>
result.vehicle.vin || ''              </form>
result.vehicle.vin || ''            </CardContent>
result.vehicle.vin || ''          </Card>
result.vehicle.vin || ''        </TabsContent>
result.vehicle.vin || ''
result.vehicle.vin || ''        <TabsContent value="plate">
result.vehicle.vin || ''          <Card>
result.vehicle.vin || ''            <CardHeader>
result.vehicle.vin || ''              <CardTitle>License Plate Lookup</CardTitle>
result.vehicle.vin || ''              <p className="text-muted-foreground">
result.vehicle.vin || ''                Get vehicle information using license plate number
result.vehicle.vin || ''              </p>
result.vehicle.vin || ''            </CardHeader>
result.vehicle.vin || ''            <CardContent>
result.vehicle.vin || ''              <form onSubmit={handlePlateSubmit} className="space-y-4">
result.vehicle.vin || ''                <div>
result.vehicle.vin || ''                  <Label htmlFor="plate">License Plate Number *</Label>
result.vehicle.vin || ''                  <Input
result.vehicle.vin || ''                    id="plate"
result.vehicle.vin || ''                    value={plateData.plate}
result.vehicle.vin || ''                    onChange={(e) => setPlateData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
result.vehicle.vin || ''                    placeholder="Enter license plate"
result.vehicle.vin || ''                    className="font-mono"
result.vehicle.vin || ''                  />
result.vehicle.vin || ''                </div>
result.vehicle.vin || ''                <div>
result.vehicle.vin || ''                  <Label htmlFor="state">State *</Label>
result.vehicle.vin || ''                  <Select value={plateData.state} onValueChange={(value) => setPlateData(prev => ({ ...prev, state: value }))}>
result.vehicle.vin || ''                    <SelectTrigger>
result.vehicle.vin || ''                      <SelectValue placeholder="Select state" />
result.vehicle.vin || ''                    </SelectTrigger>
result.vehicle.vin || ''                    <SelectContent>
result.vehicle.vin || ''                      {states.map(state => (
result.vehicle.vin || ''                        <SelectItem key={state} value={state}>{state}</SelectItem>
result.vehicle.vin || ''                      ))}
result.vehicle.vin || ''                    </SelectContent>
result.vehicle.vin || ''                  </Select>
result.vehicle.vin || ''                </div>
result.vehicle.vin || ''                <Button 
result.vehicle.vin || ''                  type="submit" 
result.vehicle.vin || ''                  disabled={!plateData.plate || !plateData.state || isUnifiedLoading}
result.vehicle.vin || ''                  className="w-full"
result.vehicle.vin || ''                >
result.vehicle.vin || ''                  {isUnifiedLoading ? (
result.vehicle.vin || ''                    <>
result.vehicle.vin || ''                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
result.vehicle.vin || ''                      Looking up plate...
result.vehicle.vin || ''                    </>
result.vehicle.vin || ''                  ) : (
result.vehicle.vin || ''                    <>
result.vehicle.vin || ''                      <FileText className="w-4 h-4 mr-2" />
result.vehicle.vin || ''                      Get Vehicle Information
result.vehicle.vin || ''                    </>
result.vehicle.vin || ''                  )}
result.vehicle.vin || ''                </Button>
result.vehicle.vin || ''              </form>
result.vehicle.vin || ''            </CardContent>
result.vehicle.vin || ''          </Card>
result.vehicle.vin || ''        </TabsContent>
result.vehicle.vin || ''      </Tabs>
result.vehicle.vin || ''    </div>
result.vehicle.vin || ''  );
result.vehicle.vin || ''}
