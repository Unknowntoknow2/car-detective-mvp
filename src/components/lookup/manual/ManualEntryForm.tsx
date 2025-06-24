
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VEHICLE_CONDITIONS, FUEL_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';
import { EnhancedVehicleSelector } from '@/components/lookup/form-parts/EnhancedVehicleSelector';
import { useMakeModels } from '@/hooks/useMakeModels';
import { useUnifiedLookup } from '@/hooks/useUnifiedLookup';
import { toast } from 'sonner';

export interface ManualEntryFormData {
  year: string;
  make: string;
  model: string;
  mileage: string;
  condition: string;
  zipCode: string;
  fuelType: string;
  transmission: string;
}

interface ManualEntryFormProps {
  tier?: "free" | "premium";
  onSubmit?: (data: any) => Promise<void>;
}

export function ManualEntryForm({ tier = "free", onSubmit }: ManualEntryFormProps) {
  // Use the enhanced vehicle selector states
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedTrimId, setSelectedTrimId] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  // Additional form data
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('good');
  const [zipCode, setZipCode] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [transmission, setTransmission] = useState('automatic');

  const { findMakeById, findModelById } = useMakeModels();
  const { processManualEntry, isLoading } = useUnifiedLookup({ mode: 'vpic', tier });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMakeId || !selectedModelId || !selectedYear) {
      toast.error('Please select make, model, and year');
      return;
    }

    console.log('📝 ManualEntryForm: Processing standardized manual entry');
    
    try {
      // Get the actual make and model names from the database
      const selectedMake = findMakeById(selectedMakeId);
      const selectedModel = findModelById(selectedModelId);
      
      if (!selectedMake || !selectedModel) {
        toast.error('Invalid make or model selection');
        return;
      }

      const formData = {
        make: selectedMake.make_name,
        model: selectedModel.model_name,
        year: selectedYear.toString(),
        mileage: mileage,
        condition: condition,
        zipCode: zipCode,
        fuelType: fuelType,
        transmission: transmission
      };

      console.log('📝 ManualEntryForm: Submitting data:', formData);
      
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Use unified lookup service for processing
        const result = processManualEntry(formData);
        if (result && result.success) {
          toast.success('Manual entry processed successfully!');
        } else {
          toast.error('Failed to process manual entry');
        }
      }
    } catch (error) {
      console.error('❌ ManualEntryForm: Submission failed:', error);
      toast.error('Failed to process manual entry. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Vehicle Entry</CardTitle>
        <p className="text-muted-foreground">
          Enter vehicle details using our comprehensive database
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EnhancedVehicleSelector
            selectedMakeId={selectedMakeId}
            selectedModelId={selectedModelId}
            selectedTrimId={selectedTrimId}
            selectedYear={selectedYear}
            onMakeChange={setSelectedMakeId}
            onModelChange={setSelectedModelId}
            onTrimChange={setSelectedTrimId}
            onYearChange={setSelectedYear}
            isDisabled={isLoading}
            showTrim={true}
            showYear={true}
            compact={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="50000"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="12345"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                maxLength={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select 
                value={condition} 
                onValueChange={setCondition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_CONDITIONS.map((conditionOption) => (
                    <SelectItem key={conditionOption.value} value={conditionOption.value}>
                      {conditionOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select 
                value={fuelType} 
                onValueChange={setFuelType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((fuel) => (
                    <SelectItem key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select 
                value={transmission} 
                onValueChange={setTransmission}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSION_TYPES.map((trans) => (
                    <SelectItem key={trans.value} value={trans.value}>
                      {trans.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!selectedMakeId || !selectedModelId || !selectedYear || isLoading}
          >
            {isLoading ? 'Processing...' : 'Get Valuation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
