
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

export function UnifiedLookupTabs() {
  const [vin, setVin] = useState('');
  const [isVinLoading, setIsVinLoading] = useState(false);
  
  // Manual entry states - now using proper vehicle selector
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedTrimId, setSelectedTrimId] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('Good');
  const [zipCode, setZipCode] = useState('');
  const [isManualLoading, setIsManualLoading] = useState(false);
  
  // Plate lookup states
  const [plateData, setPlateData] = useState({
    plate: '',
    state: ''
  });
  const [isPlateLoading, setIsPlateLoading] = useState(false);
  
  const { processVinLookup, processFreeValuation } = useValuation();
  const navigate = useNavigate();
  const { findMakeById, findModelById } = useMakeModels();

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
      
      navigate(`/results/${result.valuationId}`);
      
    } catch (error) {
      console.error('VIN lookup error:', error);
      toast.error('Failed to process VIN lookup. Please try again.');
    } finally {
      setIsVinLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMakeId || !selectedModelId || !selectedYear) {
      toast.error('Please select make, model, and year');
      return;
    }

    setIsManualLoading(true);
    
    try {
      // Get the actual make and model names from the database
      const selectedMake = findMakeById(selectedMakeId);
      const selectedModel = findModelById(selectedModelId);
      
      if (!selectedMake || !selectedModel) {
        toast.error('Invalid make or model selection');
        return;
      }

      const result = await processFreeValuation({
        make: selectedMake.make_name, // Use actual make name from database
        model: selectedModel.model_name, // Use actual model name from database
        year: selectedYear,
        mileage: parseInt(mileage) || 50000,
        condition: condition,
        zipCode: zipCode || '90210'
      });
      
      toast.success('Manual valuation completed!');
      
      navigate(`/results/${result.valuationId}`);
      
    } catch (error) {
      console.error('Manual valuation error:', error);
      toast.error('Failed to process manual valuation. Please try again.');
    } finally {
      setIsManualLoading(false);
    }
  };

  const handlePlateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plateData.plate || !plateData.state) {
      toast.error('Please enter both plate number and state');
      return;
    }

    setIsPlateLoading(true);
    
    try {
      // Mock plate lookup - in production this would call a real plate lookup API
      const mockPlateData = {
        make: 'Honda',
        model: 'Accord',
        year: 2019,
        trim: 'LX',
        bodyType: 'Sedan',
        fuelType: 'Gasoline',
        transmission: 'CVT',
        color: 'White'
      };

      toast.success('License plate lookup completed!');
      
      const result = await processFreeValuation({
        make: mockPlateData.make,
        model: mockPlateData.model,
        year: mockPlateData.year,
        mileage: 45000,
        condition: 'Good',
        zipCode: '90210'
      });
      
      navigate(`/results/${result.valuationId}`);
      
    } catch (error) {
      console.error('Plate lookup error:', error);
      toast.error('Failed to process license plate lookup. Please try again.');
    } finally {
      setIsPlateLoading(false);
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
                  isDisabled={isManualLoading}
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
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="e.g., 90210"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!selectedMakeId || !selectedModelId || !selectedYear || isManualLoading}
                  className="w-full"
                >
                  {isManualLoading ? (
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
                  disabled={!plateData.plate || !plateData.state || isPlateLoading}
                  className="w-full"
                >
                  {isPlateLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Looking up plate...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Get Valuation
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
