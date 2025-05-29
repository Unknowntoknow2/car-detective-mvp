
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useMakeModels } from '@/hooks/useMakeModels';
import MakeModelSelect from '@/components/common/MakeModelSelect';
import { Loader2, Car } from 'lucide-react';

export default function PremiumManualEntryForm() {
  const [formData, setFormData] = useState({
    makeId: '',
    modelId: '',
    year: '',
    mileage: '',
    condition: '',
    zipCode: '',
    fuelType: '',
    transmission: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { makes, models, isLoading: makesLoading, error, fetchModelsByMakeId } = useMakeModels();

  const handleMakeChange = async (makeId: string) => {
    setFormData(prev => ({ ...prev, makeId, modelId: '' }));
    if (makeId) {
      await fetchModelsByMakeId(makeId);
    }
  };

  const handleModelChange = (modelId: string) => {
    setFormData(prev => ({ ...prev, modelId }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['makeId', 'modelId', 'year', 'mileage', 'condition', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock premium manual entry processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Premium Analysis Started",
        description: "Processing your vehicle data with advanced algorithms",
      });
      
      // Navigate to premium valuation results or next step
      console.log('Premium manual entry:', formData);
    } catch (error) {
      console.error('Premium manual entry error:', error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing your vehicle data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Premium Manual Entry
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your vehicle details manually for comprehensive premium analysis with AI-enhanced insights.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Make and Model Selection */}
          <MakeModelSelect
            makes={makes}
            models={models}
            selectedMakeId={formData.makeId}
            setSelectedMakeId={handleMakeChange}
            selectedModelId={formData.modelId}
            setSelectedModelId={handleModelChange}
            isLoading={makesLoading}
            error={error}
            isDisabled={isLoading}
          />
          
          {/* Year and Mileage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year <span className="text-destructive">*</span></Label>
              <Select onValueChange={(value) => handleInputChange('year', value)} value={formData.year}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage <span className="text-destructive">*</span></Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter mileage"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
              />
            </div>
          </div>

          {/* Condition and ZIP Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition <span className="text-destructive">*</span></Label>
              <Select onValueChange={(value) => handleInputChange('condition', value)} value={formData.condition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code <span className="text-destructive">*</span></Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="Enter ZIP code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>
          </div>

          {/* Fuel Type and Transmission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select onValueChange={(value) => handleInputChange('fuelType', value)} value={formData.fuelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select onValueChange={(value) => handleInputChange('transmission', value)} value={formData.transmission}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Premium Manual Analysis Includes:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• AI-powered market analysis</li>
              <li>• Real-time comparable listings</li>
              <li>• Advanced depreciation modeling</li>
              <li>• Feature-based value adjustments</li>
              <li>• Regional market insights</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Analysis...
              </>
            ) : (
              'Get Premium Valuation'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
