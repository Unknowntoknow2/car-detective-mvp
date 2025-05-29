
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Crown, CheckCircle, TrendingUp, FileText, BarChart3, Award } from 'lucide-react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { validateVIN } from '@/utils/validation/vin-validation';

interface PremiumManualEntryFormProps {
  formData?: any;
  setFormData?: (data: any) => void;
  onSubmit?: (data: any) => void;
}

export default function PremiumManualEntryForm({ 
  formData, 
  setFormData, 
  onSubmit 
}: PremiumManualEntryFormProps) {
  const { toast } = useToast();
  const { getMakes, getModels, getYearOptions } = useVehicleData();
  
  const [localFormData, setLocalFormData] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: '',
    zipCode: '',
    vin: '',
    ...formData
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vinValidation, setVinValidation] = useState<{ isValid: boolean; error?: string } | null>(null);

  const makes = getMakes();
  const models = getModels(localFormData.make);
  const years = getYearOptions(1990);

  const updateFormData = (field: string, value: string) => {
    const newData = { ...localFormData, [field]: value };
    setLocalFormData(newData);
    
    if (setFormData) {
      setFormData(newData);
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset model when make changes
    if (field === 'make') {
      newData.model = '';
      setLocalFormData(newData);
      if (setFormData) {
        setFormData(newData);
      }
    }
  };

  const handleVinChange = (value: string) => {
    const cleanVin = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
    updateFormData('vin', cleanVin);
    
    if (cleanVin && cleanVin.length === 17) {
      const validation = validateVIN(cleanVin);
      setVinValidation(validation);
    } else if (cleanVin.length > 0) {
      setVinValidation({ isValid: false, error: 'VIN must be 17 characters' });
    } else {
      setVinValidation(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!localFormData.year) newErrors.year = 'Year is required';
    if (!localFormData.make) newErrors.make = 'Make is required';
    if (!localFormData.model) newErrors.model = 'Model is required';
    if (!localFormData.mileage) {
      newErrors.mileage = 'Mileage is required';
    } else if (parseInt(localFormData.mileage) < 0) {
      newErrors.mileage = 'Mileage must be positive';
    }
    if (!localFormData.condition) newErrors.condition = 'Condition is required';
    if (!localFormData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(localFormData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 5 digits';
    }
    
    if (localFormData.vin && (!vinValidation || !vinValidation.isValid)) {
      newErrors.vin = vinValidation?.error || 'Invalid VIN';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(localFormData);
      } else {
        // Default submission logic
        console.log('Premium manual entry submitted:', localFormData);
        toast({
          title: "Premium Valuation Submitted",
          description: "Your premium valuation is being processed.",
        });
      }
    } catch (error) {
      console.error('Premium manual entry error:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit your valuation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl text-amber-900">
              <Crown className="h-6 w-6 text-amber-600" />
              Premium Manual Entry
            </CardTitle>
            <p className="text-amber-700 mt-2">
              Enter your vehicle details manually for comprehensive premium analysis and valuation.
            </p>
          </div>
          <Badge className="bg-amber-600 text-white px-3 py-1">
            <Award className="h-4 w-4 mr-1" />
            Premium
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium">
                Year <span className="text-red-500">*</span>
              </Label>
              <Select value={localFormData.year} onValueChange={(value) => updateFormData('year', value)}>
                <SelectTrigger className={errors.year ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="mileage" className="text-sm font-medium">
                Mileage <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mileage"
                type="number"
                placeholder="e.g., 50000"
                value={localFormData.mileage}
                onChange={(e) => updateFormData('mileage', e.target.value)}
                className={errors.mileage ? 'border-red-300' : ''}
                min="0"
              />
              {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
            </div>
          </div>

          {/* Make and Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="make" className="text-sm font-medium">
                Make <span className="text-red-500">*</span>
              </Label>
              <Select value={localFormData.make} onValueChange={(value) => updateFormData('make', value)}>
                <SelectTrigger className={errors.make ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Select a make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map(make => (
                    <SelectItem key={make.id} value={make.make_name}>
                      {make.make_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium">
                Model <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={localFormData.model} 
                onValueChange={(value) => updateFormData('model', value)}
                disabled={!localFormData.make}
              >
                <SelectTrigger className={errors.model ? 'border-red-300' : ''}>
                  <SelectValue placeholder={localFormData.make ? "Select model" : "Select make first"} />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.model_name}>
                      {model.model_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
            </div>
          </div>

          {/* Condition and ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-sm font-medium">
                Condition <span className="text-red-500">*</span>
              </Label>
              <Select value={localFormData.condition} onValueChange={(value) => updateFormData('condition', value)}>
                <SelectTrigger className={errors.condition ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              {errors.condition && <p className="text-sm text-red-500">{errors.condition}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium">
                ZIP Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zipCode"
                placeholder="e.g., 90210"
                value={localFormData.zipCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').substring(0, 5);
                  updateFormData('zipCode', value);
                }}
                className={errors.zipCode ? 'border-red-300' : ''}
                maxLength={5}
              />
              {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
            </div>
          </div>

          {/* VIN (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="vin" className="text-sm font-medium">
              VIN (Optional)
            </Label>
            <div className="relative">
              <Input
                id="vin"
                placeholder="17-character VIN (optional)"
                value={localFormData.vin}
                onChange={(e) => handleVinChange(e.target.value)}
                className={`font-mono ${errors.vin ? 'border-red-300' : vinValidation?.isValid ? 'border-green-300' : ''}`}
                maxLength={17}
              />
              {vinValidation?.isValid && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
            {errors.vin && <p className="text-sm text-red-500">{errors.vin}</p>}
            {vinValidation?.isValid && (
              <p className="text-sm text-green-600">✓ Valid VIN - Enhanced accuracy enabled</p>
            )}
            <p className="text-xs text-amber-600">
              Adding a VIN significantly improves valuation accuracy and unlocks additional premium features.
            </p>
          </div>

          {/* Premium Features */}
          <div className="bg-white/80 rounded-lg p-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Premium Manual Entry Includes:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-amber-800">
                <BarChart3 className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Advanced algorithmic valuation</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Detailed market analysis</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Comprehensive feature assessment</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <FileText className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Professional valuation report</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Market trend predictions</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <Award className="h-4 w-4 text-amber-600" />
                <span className="text-sm">AI-powered insights</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-2 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Premium Valuation...
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4" />
                  Get Premium Valuation
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
