
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Car, FileText, Loader2 } from 'lucide-react';
import { useValuation } from '@/contexts/ValuationContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EnhancedVehicleSelector } from '@/components/lookup/form-parts/EnhancedVehicleSelector';
import { useMakeModels } from '@/hooks/useMakeModels';
import { useUnifiedLookup } from '@/hooks/useUnifiedLookup';
import { processValuation } from '@/utils/valuation/unifiedValuationEngine';

export function UnifiedLookupTabs() {
  const [vin, setVin] = useState('');
  
  // Manual entry states - now using proper vehicle selector
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedTrimId, setSelectedTrimId] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('good');
  const [zipCode, setZipCode] = useState('');
  
  // Plate lookup states
  const [plateData, setPlateData] = useState({
    plate: '',
    state: ''
  });
  
  const { processFreeValuation } = useValuation();
  const navigate = useNavigate();
  const { findMakeById, findModelById } = useMakeModels();
  
  // Use the real unified lookup service
  const { 
    isLoading: isUnifiedLoading, 
    lookupByVin, 
    lookupByPlate, 
    processManualEntry 
  } = useUnifiedLookup({ mode: 'vpic', tier: 'free' });

  const validateVin = (vin: string) => {
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  };

  const handleVinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateVin(vin)) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    console.log('🚗 VIN Lookup: Decoding VIN to find vehicle:', vin);
    
    try {
      // First decode the VIN to get vehicle information
      const result = await lookupByVin(vin);
      
      if (result && result.success && result.vehicle) {
        console.log('✅ VIN Lookup: Successfully decoded vehicle:', result.vehicle);
        
        // Navigate to follow-up questions with decoded vehicle data (same pattern as plate lookup)
        const params = new URLSearchParams({
          year: result.vehicle.year.toString(),
          make: result.vehicle.make,
          model: result.vehicle.model,
          trim: result.vehicle.trim || '',
          vin: vin,
          engine: result.vehicle.engine || '',
          transmission: result.vehicle.transmission || '',
          bodyType: result.vehicle.bodyType || '',
          fuelType: result.vehicle.fuelType || '',
          drivetrain: result.vehicle.drivetrain || '',
          source: 'vin'
        });
        
        toast.success('VIN decoded successfully!');
        navigate(`/valuation/followup?${params.toString()}`);
        
      } else {
        console.error('❌ VIN Lookup: Failed to decode VIN:', result?.error);
        toast.error('Failed to decode VIN. Please check the VIN and try again.');
      }
      
    } catch (error) {
      console.error('❌ VIN lookup error:', error);
      toast.error('VIN lookup service temporarily unavailable. Please try again.');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMakeId || !selectedModelId || !selectedYear) {
      toast.error('Please select make, model, and year');
      return;
    }

    console.log('🔧 Manual Entry: Processing with database vehicle data');
    
    try {
      // Get the actual make and model names from the database
      const selectedMake = findMakeById(selectedMakeId);
      const selectedModel = findModelById(selectedModelId);
      
      if (!selectedMake || !selectedModel) {
        toast.error('Invalid make or model selection');
        return;
      }

      // For manual entry, go directly to results since user provided all details
      // FIXED: Pass actual zipCode instead of defaulting to '90210'
      const valuationResult = await processFreeValuation({
        make: selectedMake.make_name,
        model: selectedModel.model_name,
        year: selectedYear,
        mileage: parseInt(mileage) || 0,
        condition: condition,
        zipCode: zipCode || '', // FIXED: Use empty string instead of '90210'
        vin: undefined // Manual entry doesn't have VIN
      });
      
      console.log('✅ Manual Entry: Valuation completed:', valuationResult);
      toast.success('Manual valuation completed!');
      
      // Navigate to results using unified route
      navigate(`/results/${valuationResult.valuationId}`);
      
    } catch (error) {
      console.error('❌ Manual valuation error:', error);
      toast.error('Failed to process manual valuation. Please try again.');
    }
  };

  const handlePlateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plateData.plate || !plateData.state) {
      toast.error('Please enter both plate number and state');
      return;
    }

    console.log('🏷️ Plate Lookup: Processing license plate lookup');
    
    try {
      const result = await lookupByPlate(plateData.plate, plateData.state);
      
      if (result && result.success && result.vehicle) {
        console.log('✅ Plate Lookup: Successfully found vehicle:', result.vehicle);
        
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
        console.error('❌ Plate Lookup: Failed:', result?.error);
        toast.error('Failed to find vehicle by license plate. Please try VIN or manual entry.');
      }
      
    } catch (error) {
      console.error('❌ Plate lookup error:', error);
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
                  disabled={!validateVin(vin) || isUnifiedLoading}
                  className="w-full"
                >
                  {isUnifiedLoading ? (
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

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <p className="text-muted-foreground">
                Enter vehicle details manually for immediate valuation
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <EnhancedVehicleSelector
                  selectedMakeId={selectedMakeId}
                  selectedModelId={selectedModelId}
                  selectedTrimId={selectedTrimId}
                  selectedYear={selectedYear}
                  onMakeChange={setSelectedMakeId}
                  onModelChange={setSelectedModelId}
                  onTrimChange={setSelectedTrimId}
                  onYearChange={setSelectedYear}
                  isDisabled={isUnifiedLoading}
                  showTrim={true}
                  showYear={true}
                  compact={true}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      min="0"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="e.g., 12345"
                      maxLength={5}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Required for accurate market pricing
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!selectedMakeId || !selectedModelId || !selectedYear || !zipCode || isUnifiedLoading}
                  className="w-full"
                >
                  {isUnifiedLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Car className="w-4 h-4 mr-2" />
                      Get Valuation
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
