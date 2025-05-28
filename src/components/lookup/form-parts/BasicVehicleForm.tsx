
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { useMakeModels } from '@/hooks/useMakeModels';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BasicVehicleFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function BasicVehicleForm({ onSubmit, initialData }: BasicVehicleFormProps) {
  const { 
    makes, 
    models, 
    isLoading, 
    isLoadingModels, 
    error, 
    getModelsByMakeId 
  } = useMakeModels();

  const [formData, setFormData] = useState({
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || '',
    mileage: initialData?.mileage || '',
    zipCode: initialData?.zipCode || '',
    ...initialData
  });

  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [noModelsFound, setNoModelsFound] = useState(false);

  // Handle make selection
  const handleMakeChange = async (makeId: string) => {
    console.log('Make selected:', makeId);
    setSelectedMakeId(makeId);
    setSelectedModelId('');
    setNoModelsFound(false);
    
    // Find make name and update form data
    const selectedMake = makes.find(make => make.id === makeId);
    if (selectedMake) {
      setFormData(prev => ({
        ...prev,
        make: selectedMake.make_name,
        model: '', // Reset model when make changes
        trim: ''   // Reset trim when make changes
      }));
      
      // Fetch models for this make
      const modelsList = await getModelsByMakeId(makeId);
      if (modelsList.length === 0) {
        setNoModelsFound(true);
      }
    }
  };

  // Handle model selection
  const handleModelChange = (modelId: string) => {
    console.log('Model selected:', modelId);
    setSelectedModelId(modelId);
    
    // Find model name and update form data
    const selectedModel = models.find(model => model.id === modelId);
    if (selectedModel) {
      setFormData(prev => ({
        ...prev,
        model: selectedModel.model_name,
        trim: '' // Reset trim when model changes
      }));
    }
  };

  // Handle other form field changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    onSubmit(formData);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading vehicle data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Make Selection */}
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Select value={selectedMakeId} onValueChange={handleMakeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make.id} value={make.id}>
                    {make.make_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select 
              value={selectedModelId} 
              onValueChange={handleModelChange}
              disabled={!selectedMakeId || isLoadingModels}
            >
              <SelectTrigger id="model">
                <SelectValue 
                  placeholder={
                    !selectedMakeId 
                      ? "Select make first" 
                      : isLoadingModels 
                        ? "Loading models..." 
                        : "Select a model"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isLoadingModels && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Loading models...
              </div>
            )}
            
            {noModelsFound && selectedMakeId && !isLoadingModels && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No models found for the selected make. This might be a data issue.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="e.g. 2020"
              value={formData.year}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value) || '')}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>

          {/* Mileage */}
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="e.g. 45000"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || '')}
              min="0"
            />
          </div>

          {/* Zip Code */}
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="e.g. 12345"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              maxLength={5}
              pattern="[0-9]{5}"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!formData.make || !formData.model || !formData.year || !formData.mileage || !formData.zipCode}
          >
            Get Valuation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
