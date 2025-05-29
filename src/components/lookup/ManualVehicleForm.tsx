
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MakeModelSelector } from './form-parts/MakeModelSelector';
import { Loader2 } from 'lucide-react';

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

export function ManualVehicleForm({ onSubmit, isLoading = false }: ManualVehicleFormProps) {
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [formData, setFormData] = useState({
    trim: '',
    year: new Date().getFullYear(),
    fuelType: 'gasoline',
    transmission: 'automatic',
    drivetrain: 'fwd',
    bodyType: 'sedan',
    vin: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedMakeId) {
      newErrors.make = 'Please select a make';
    }
    if (!selectedModelId) {
      newErrors.model = 'Please select a model';
    }
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Get the actual make and model names for submission
    // For now, we'll use the IDs as the submission expects strings
    // This maintains compatibility with existing code
    const specs: VehicleSpecs = {
      make: selectedMakeId, // Using ID for now - could be enhanced to use names
      model: selectedModelId, // Using ID for now - could be enhanced to use names
      trim: formData.trim,
      year: formData.year,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      drivetrain: formData.drivetrain,
      bodyType: formData.bodyType,
      vin: formData.vin
    };

    onSubmit(specs);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1980 + 2 }, (_, i) => currentYear + 1 - i);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Enter Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Make and Model Selection */}
          <MakeModelSelector
            selectedMakeId={selectedMakeId}
            selectedModelId={selectedModelId}
            onMakeChange={setSelectedMakeId}
            onModelChange={setSelectedModelId}
            disabled={isLoading}
          />
          
          {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}

          {/* Basic Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trim">Trim (Optional)</Label>
              <Input
                id="trim"
                value={formData.trim}
                onChange={(e) => setFormData(prev => ({ ...prev, trim: e.target.value }))}
                placeholder="e.g., LE, Sport, Limited"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.year.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}
                disabled={isLoading}
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
            </div>
          </div>

          {/* Vehicle Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select 
                value={formData.fuelType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}
                disabled={isLoading}
              >
                <SelectTrigger id="fuelType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="flex">Flex Fuel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <Select 
                value={formData.transmission} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
                disabled={isLoading}
              >
                <SelectTrigger id="transmission">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="drivetrain">Drivetrain</Label>
              <Select 
                value={formData.drivetrain} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, drivetrain: value }))}
                disabled={isLoading}
              >
                <SelectTrigger id="drivetrain">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fwd">Front-Wheel Drive</SelectItem>
                  <SelectItem value="rwd">Rear-Wheel Drive</SelectItem>
                  <SelectItem value="awd">All-Wheel Drive</SelectItem>
                  <SelectItem value="4wd">4-Wheel Drive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bodyType">Body Type</Label>
              <Select 
                value={formData.bodyType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, bodyType: value }))}
                disabled={isLoading}
              >
                <SelectTrigger id="bodyType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="coupe">Coupe</SelectItem>
                  <SelectItem value="convertible">Convertible</SelectItem>
                  <SelectItem value="hatchback">Hatchback</SelectItem>
                  <SelectItem value="wagon">Wagon</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* VIN (Optional) */}
          <div>
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className="font-mono"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !selectedMakeId || !selectedModelId}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
