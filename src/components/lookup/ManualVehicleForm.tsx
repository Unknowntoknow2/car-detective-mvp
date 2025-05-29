
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MakeModelSelect } from '@/components/common/MakeModelSelect';
import { useMakeModels } from '@/hooks/useMakeModels';
import { Car, Settings } from 'lucide-react';

interface VehicleSpecs {
  make: string;
  model: string;
  trim?: string;
  year: number;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  bodyType: string;
  vin?: string;
}

interface ManualVehicleFormProps {
  onSubmit: (specs: VehicleSpecs) => void;
  isLoading?: boolean;
}

const fuelTypes = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'alternative', label: 'Alternative Fuel' }
];

const transmissionTypes = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'cvt', label: 'CVT' },
  { value: 'dual_clutch', label: 'Dual Clutch' },
  { value: 'sequential', label: 'Sequential' }
];

const drivetrainTypes = [
  { value: 'fwd', label: 'Front-Wheel Drive (FWD)' },
  { value: 'rwd', label: 'Rear-Wheel Drive (RWD)' },
  { value: 'awd', label: 'All-Wheel Drive (AWD)' },
  { value: '4wd', label: 'Four-Wheel Drive (4WD)' }
];

const bodyTypes = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'truck', label: 'Truck' },
  { value: 'van', label: 'Van' },
  { value: 'crossover', label: 'Crossover' }
];

export function ManualVehicleForm({ onSubmit, isLoading }: ManualVehicleFormProps) {
  const { makes, models, getModelsByMakeId, isLoadingModels } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [formData, setFormData] = useState<Partial<VehicleSpecs>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);

  const handleMakeChange = async (makeId: string) => {
    setSelectedMakeId(makeId);
    setSelectedModelId('');
    await getModelsByMakeId(makeId);
    
    const selectedMake = makes.find(make => make.id === makeId);
    setFormData(prev => ({ ...prev, make: selectedMake?.make_name || '' }));
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const selectedModel = models.find(model => model.id === modelId);
    setFormData(prev => ({ ...prev, model: selectedModel?.model_name || '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.make) newErrors.make = 'Make is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!formData.transmission) newErrors.transmission = 'Transmission is required';
    if (!formData.bodyType) newErrors.bodyType = 'Body type is required';

    if (formData.vin && formData.vin.length !== 17) {
      newErrors.vin = 'VIN must be 17 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const vehicleSpecs: VehicleSpecs = {
      make: formData.make!,
      model: formData.model!,
      trim: formData.trim,
      year: formData.year!,
      fuelType: formData.fuelType!,
      transmission: formData.transmission!,
      drivetrain: formData.drivetrain || 'fwd',
      bodyType: formData.bodyType!,
      vin: formData.vin
    };

    onSubmit(vehicleSpecs);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Specifications
        </CardTitle>
        <CardDescription>
          Enter your vehicle's basic information. Additional details will be collected in the next step.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Make and Model Selection */}
          <div className="space-y-4">
            <MakeModelSelect
              makes={makes}
              models={models}
              selectedMakeId={selectedMakeId}
              setSelectedMakeId={setSelectedMakeId}
              selectedModelId={selectedModelId}
              setSelectedModelId={setSelectedModelId}
              onMakeChange={handleMakeChange}
              isLoadingModels={isLoadingModels}
              error={errors.make || errors.model}
            />
          </div>

          {/* Year and Trim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select 
                value={formData.year?.toString() || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trim">Trim Level (Optional)</Label>
              <Input
                id="trim"
                value={formData.trim || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, trim: e.target.value }))}
                placeholder="e.g., LX, EX, Sport"
              />
            </div>
          </div>

          {/* Fuel Type and Transmission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fuel Type *</Label>
              <Select 
                value={formData.fuelType || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map(fuel => (
                    <SelectItem key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fuelType && <p className="text-sm text-red-500">{errors.fuelType}</p>}
            </div>

            <div className="space-y-2">
              <Label>Transmission *</Label>
              <Select 
                value={formData.transmission || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissionTypes.map(trans => (
                    <SelectItem key={trans.value} value={trans.value}>
                      {trans.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.transmission && <p className="text-sm text-red-500">{errors.transmission}</p>}
            </div>
          </div>

          {/* Drivetrain and Body Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Drivetrain</Label>
              <Select 
                value={formData.drivetrain || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, drivetrain: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select drivetrain" />
                </SelectTrigger>
                <SelectContent>
                  {drivetrainTypes.map(drive => (
                    <SelectItem key={drive.value} value={drive.value}>
                      {drive.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Body Type *</Label>
              <Select 
                value={formData.bodyType || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, bodyType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map(body => (
                    <SelectItem key={body.value} value={body.value}>
                      {body.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bodyType && <p className="text-sm text-red-500">{errors.bodyType}</p>}
            </div>
          </div>

          {/* Optional VIN */}
          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              value={formData.vin || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
              placeholder="17-character VIN for enhanced accuracy"
              maxLength={17}
              className="font-mono"
            />
            {errors.vin && <p className="text-sm text-red-500">{errors.vin}</p>}
            <p className="text-xs text-gray-500">
              VIN helps improve valuation accuracy but is not required
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Settings className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to Vehicle Details'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
