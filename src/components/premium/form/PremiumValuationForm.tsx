
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { VehicleDetailsInputs } from '@/components/lookup/form-parts/VehicleDetailsInputs';
import { toast } from 'sonner';
import { Loader2, ArrowRight } from 'lucide-react';
import { useVehicleData } from '@/hooks/useVehicleData';

interface FormDataType {
  make: string;
  model: string;
  year: number | string;
  mileage: string | number;
  trim: string;
  color: string;
  zipCode: string;
  condition: string;
  hasAccident: boolean;
  accidentDescription: string;
  titleStatus: string;
}

export function PremiumValuationForm() {
  const [formData, setFormData] = useState<FormDataType>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    trim: '',
    color: '',
    zipCode: '',
    condition: 'good',
    hasAccident: false,
    accidentDescription: '',
    titleStatus: 'clean'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { makes, getModelsByMake } = useVehicleData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.make) {
      newErrors.make = 'Make is required';
    }
    
    if (!formData.model) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 5 digits';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success('Premium valuation completed successfully!');
      // Here you would typically redirect to a results page or show results
      
    } catch (error) {
      console.error('Error submitting valuation:', error);
      toast.error('An error occurred while processing your valuation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const setMake = (value: string) => {
    setFormData(prev => ({ ...prev, make: value, model: '' }));
  };

  const setModel = (value: string) => {
    setFormData(prev => ({ ...prev, model: value }));
  };

  const setYear = (value: number | string | '') => {
    setFormData(prev => ({ ...prev, year: value }));
  };

  const setMileage = (value: number | string) => {
    setFormData(prev => ({ ...prev, mileage: value }));
  };

  const setTrim = (value: string) => {
    setFormData(prev => ({ ...prev, trim: value }));
  };

  const setColor = (value: string) => {
    setFormData(prev => ({ ...prev, color: value }));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold">Premium Vehicle Valuation</h3>
        <p className="text-sm text-muted-foreground">Complete the form below to receive a detailed valuation</p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-md font-medium">Vehicle Information</h4>
            <VehicleDetailsInputs
              make={formData.make}
              setMake={setMake}
              model={formData.model}
              setModel={setModel}
              year={formData.year}
              setYear={setYear}
              mileage={formData.mileage}
              setMileage={setMileage}
              trim={formData.trim}
              setTrim={setTrim}
              color={formData.color}
              setColor={setColor}
            />
          </div>
          
          <div className="space-y-4">
            <h4 className="text-md font-medium">Location</h4>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="Enter your ZIP code"
                value={formData.zipCode}
                onChange={handleInputChange}
                className={errors.zipCode ? 'border-red-500' : ''}
                maxLength={5}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Get Premium Valuation <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
