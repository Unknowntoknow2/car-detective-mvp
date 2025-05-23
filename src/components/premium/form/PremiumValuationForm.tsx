import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehicleDetailsInputs } from '@/components/lookup/form-parts/VehicleDetailsInputs';
import { YearMileageInputs } from '@/components/lookup/form-parts/fields/YearMileageInputs';
import { useState } from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

export function PremiumValuationForm() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [mileage, setMileage] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('vehicle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading } = useVehicleData();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!make) newErrors.make = 'Make is required';
    if (!model) newErrors.model = 'Model is required';
    if (!year) newErrors.year = 'Year is required';
    if (!mileage) newErrors.mileage = 'Mileage is required';
    if (!zipCode) newErrors.zipCode = 'ZIP Code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would submit the form data to your API
      console.log('Submitting premium valuation:', {
        make,
        model,
        year,
        mileage,
        zipCode,
        trim: selectedTrim
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to results page or show success message
      window.location.href = '/premium/results';
    } catch (error) {
      console.error('Error submitting valuation:', error);
      setErrors({
        form: 'There was an error submitting your valuation. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="premium-form">
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
              <TabsTrigger value="condition">Condition</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vehicle" className="space-y-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (validateForm()) setActiveTab('condition');
              }}>
                {/* Make and Model Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="make" className="text-sm font-medium text-slate-700">
                      Make <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="make"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      placeholder="e.g. Toyota"
                      className={`h-10 ${errors.make ? 'border-red-300' : ''}`}
                    />
                    {errors.make && <FormValidationError error={errors.make} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-sm font-medium text-slate-700">
                      Model <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => {
                        setModel(e.target.value);
                        setSelectedModel(e.target.value);
                        setSelectedModelId(e.target.value);
                      }}
                      placeholder="e.g. Camry"
                      className={`h-10 ${errors.model ? 'border-red-300' : ''}`}
                    />
                    {errors.model && <FormValidationError error={errors.model} />}
                  </div>
                </div>

                {/* Year and Mileage Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <YearMileageInputs
                    selectedYear={year}
                    setSelectedYear={setYear}
                    mileage={mileage}
                    setMileage={setMileage}
                    errors={errors}
                  />
                </div>

                {/* ZIP Code Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">
                      ZIP Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="e.g. 90210"
                      maxLength={10}
                      className={`h-10 ${errors.zipCode ? 'border-red-300' : ''}`}
                    />
                    {errors.zipCode && <FormValidationError error={errors.zipCode} />}
                  </div>
                </div>

                {/* Additional Vehicle Details */}
                <VehicleDetailsInputs
                  selectedModel={selectedModel}
                  selectedModelId={selectedModelId}
                  selectedTrim={selectedTrim}
                  setSelectedTrim={setSelectedTrim}
                  errors={errors}
                />

                <div className="mt-6 flex justify-end">
                  <Button type="submit" data-testid="next-step">
                    Continue
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="condition" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vehicle Condition</h3>
                <p className="text-muted-foreground">
                  Rate the condition of your vehicle to get a more accurate valuation.
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="exterior-condition">Exterior Condition</Label>
                    <input
                      id="exterior-condition"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor</span>
                      <span>Fair</span>
                      <span>Good</span>
                      <span>Very Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interior-condition">Interior Condition</Label>
                    <input
                      id="interior-condition"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor</span>
                      <span>Fair</span>
                      <span>Good</span>
                      <span>Very Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mechanical-condition">Mechanical Condition</Label>
                    <input
                      id="mechanical-condition"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor</span>
                      <span>Fair</span>
                      <span>Good</span>
                      <span>Very Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('vehicle')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('features')} data-testid="next-step">
                    Continue
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vehicle Features</h3>
                <p className="text-muted-foreground">
                  Select all features that apply to your vehicle.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="leather-seats" className="rounded" />
                      <Label htmlFor="leather-seats">Leather Seats</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sunroof" className="rounded" />
                      <Label htmlFor="sunroof">Sunroof/Moonroof</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="navigation" className="rounded" />
                      <Label htmlFor="navigation">Navigation System</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="bluetooth" className="rounded" />
                      <Label htmlFor="bluetooth">Bluetooth</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="backup-camera" className="rounded" />
                      <Label htmlFor="backup-camera">Backup Camera</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="third-row" className="rounded" />
                      <Label htmlFor="third-row">Third Row Seating</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="heated-seats" className="rounded" />
                      <Label htmlFor="heated-seats">Heated Seats</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="premium-audio" className="rounded" />
                      <Label htmlFor="premium-audio">Premium Audio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="alloy-wheels" className="rounded" />
                      <Label htmlFor="alloy-wheels">Alloy Wheels</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="towing-package" className="rounded" />
                      <Label htmlFor="towing-package">Towing Package</Label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('condition')}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} data-testid="submit-valuation">
                    {isSubmitting ? 'Processing...' : 'Get Premium Valuation'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {errors.form && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{errors.form}</p>
        </div>
      )}
    </div>
  );
}
