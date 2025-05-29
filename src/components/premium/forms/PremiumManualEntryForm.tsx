import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Car } from 'lucide-react';
import { toast } from 'sonner';

interface PremiumManualEntryFormProps {
  formData?: any;
  setFormData?: (data: any) => void;
  onSubmit?: (data: any) => void;
}

const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'very-good', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

const FUEL_TYPE_OPTIONS = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'flex-fuel', label: 'Flex Fuel' }
];

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'cvt', label: 'CVT' }
];

export default function PremiumManualEntryForm({ 
  formData: externalFormData, 
  setFormData: externalSetFormData, 
  onSubmit: externalOnSubmit 
}: PremiumManualEntryFormProps) {
  const [internalFormData, setInternalFormData] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: '',
    zipCode: '',
    fuelType: '',
    transmission: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Use external state if provided, otherwise use internal state
  const formData = externalFormData || internalFormData;
  const setFormData = externalSetFormData || setInternalFormData;

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['year', 'make', 'model', 'mileage', 'condition', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // If external onSubmit is provided, use it
      if (externalOnSubmit) {
        externalOnSubmit(formData);
        return;
      }

      // Otherwise, use internal logic
      toast.success('Processing premium manual valuation...');
      console.log('Premium manual entry:', formData);
      
    } catch (error) {
      console.error('Premium manual entry error:', error);
      toast.error('An error occurred while processing your valuation');
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
          Enter your vehicle details for comprehensive analysis with CARFAX data, auction comparisons, and AI-powered insights.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder="2020"
                value={formData.year}
                onChange={(e) => updateFormData('year', e.target.value)}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                type="text"
                placeholder="Toyota"
                value={formData.make}
                onChange={(e) => updateFormData('make', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                type="text"
                placeholder="Camry"
                value={formData.model}
                onChange={(e) => updateFormData('model', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="50000"
                value={formData.mileage}
                onChange={(e) => updateFormData('mileage', e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => updateFormData('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="12345"
                value={formData.zipCode}
                onChange={(e) => updateFormData('zipCode', e.target.value)}
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={(value) => updateFormData('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(value) => updateFormData('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Premium Features Include:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• CARFAX vehicle history report</li>
              <li>• Real-time auction data analysis</li>
              <li>• AI-powered condition assessment</li>
              <li>• Market trend predictions</li>
              <li>• Comprehensive valuation breakdown</li>
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
                Processing Valuation...
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
