
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useVehicleData } from '@/hooks/useVehicleData';
import { useNavigate } from 'react-router-dom';
import { Loader2, Car, CheckCircle, Brain } from 'lucide-react';

interface PremiumManualEntryFormProps {
  formData?: any;
  setFormData?: (data: any) => void;
  onSubmit?: (data: any) => void;
}

export default function PremiumManualEntryForm({ formData, setFormData, onSubmit }: PremiumManualEntryFormProps) {
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVinValid, setIsVinValid] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const navigate = useNavigate();
  const { makes, getModelsByMake, getYearOptions } = useVehicleData();

  // Get models for selected make
  const [models, setModels] = useState<Array<{id: string, model_name: string}>>([]);

  useEffect(() => {
    if (selectedMakeId) {
      const modelsList = getModelsByMake(selectedMakeId);
      setModels(modelsList);
      setSelectedModel(''); // Reset model when make changes
    } else {
      setModels([]);
    }
  }, [selectedMakeId, getModelsByMake]);

  // VIN validation
  useEffect(() => {
    if (vin.length === 0) {
      setIsVinValid(null);
    } else if (vin.length === 17) {
      setIsVinValid(true);
    } else {
      setIsVinValid(false);
    }
  }, [vin]);

  const yearOptions = getYearOptions(1990);

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedMakeId) newErrors.make = 'Please select a make';
    if (!selectedModel) newErrors.model = 'Please select a model';
    if (!selectedYear) newErrors.year = 'Please select a year';
    if (!mileage) newErrors.mileage = 'Please enter mileage';
    if (!condition) newErrors.condition = 'Please select condition';
    if (!zipCode || zipCode.length !== 5) newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    if (vin && vin.length !== 17) newErrors.vin = 'VIN must be exactly 17 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fix the errors and try again",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const selectedMake = makes.find(make => make.id === selectedMakeId);
      const formDataToSubmit = {
        make: selectedMake?.make_name,
        model: selectedModel,
        year: parseInt(selectedYear),
        mileage: parseInt(mileage),
        condition,
        zipCode,
        vin: vin || undefined,
        isPremium: true
      };

      if (onSubmit) {
        onSubmit(formDataToSubmit);
      } else {
        // Default behavior - navigate to manual valuation
        navigate('/valuation/manual?premium=true', { 
          state: { 
            formData: formDataToSubmit, 
            isPremium: true 
          } 
        });
      }

      toast({
        title: "Premium Valuation Started",
        description: "Processing your premium manual valuation...",
      });

    } catch (error) {
      console.error('Premium manual entry error:', error);
      toast({
        title: "Submission Error",
        description: "An error occurred while processing your valuation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMileage(value);
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17);
    setVin(value);
  };

  const isFormValid = selectedMakeId && selectedModel && selectedYear && mileage && condition && zipCode.length === 5 && (!vin || vin.length === 17);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Car className="h-6 w-6" />
          Premium Manual Entry
        </CardTitle>
        <p className="text-amber-100">
          Enter your vehicle details manually for comprehensive premium analysis and valuation.
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Year and Mileage Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-semibold text-amber-800">
                Year <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger 
                  id="year"
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.year ? 'border-red-300 focus:ring-red-200' : 'border-amber-200 focus:ring-amber-200 focus:border-amber-400'
                  }`}
                >
                  <SelectValue placeholder="2022" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-sm text-red-600">{errors.year}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-sm font-semibold text-amber-800">
                Mileage <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mileage"
                type="text"
                value={mileage}
                onChange={handleMileageChange}
                placeholder="e.g., 50000"
                className={`h-12 border-2 transition-all duration-200 ${
                  errors.mileage ? 'border-red-300 focus:ring-red-200' : 'border-amber-200 focus:ring-amber-200 focus:border-amber-400'
                }`}
              />
              {errors.mileage && <p className="text-sm text-red-600">{errors.mileage}</p>}
            </div>
          </div>

          {/* Make and Model Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="make" className="text-sm font-semibold text-amber-800">
                Select Make <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedMakeId} onValueChange={(value: string) => setSelectedMakeId(value)}>
                <SelectTrigger 
                  id="make"
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.make ? 'border-red-300 focus:ring-red-200' : 'border-amber-200 focus:ring-amber-200 focus:border-amber-400'
                  }`}
                >
                  <SelectValue placeholder="Select a make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map(make => (
                    <SelectItem key={make.id} value={make.id}>
                      {make.make_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.make && <p className="text-sm text-red-600">{errors.make}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-semibold text-amber-800">
                Select Model <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={selectedModel} 
                onValueChange={(value: string) => setSelectedModel(value)}
                disabled={!selectedMakeId || models.length === 0}
              >
                <SelectTrigger 
                  id="model"
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.model ? 'border-red-300 focus:ring-red-200' : 'border-amber-200 focus:ring-amber-200 focus:border-amber-400'
                  }`}
                >
                  <SelectValue placeholder={selectedMakeId ? "Select model" : "Select make first"} />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.model_name}>
                      {model.model_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
            </div>
          </div>

          {/* Condition and ZIP Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-sm font-semibold text-amber-800">
                Condition <span className="text-red-500">*</span>
              </Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger 
                  id="condition"
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.condition ? 'border-red-300 focus:ring-red-200' : 'border-amber-200 focus:ring-amber-200 focus:border-amber-400'
                  }`}
                >
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.condition && <p className="text-sm text-red-600">{errors.condition}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-semibold text-amber-800">
                ZIP Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={handleZipCodeChange}
                placeholder="e.g., 90210"
                maxLength={5}
                className={`h-12 border-2 transition-all duration-200 ${
                  errors.zipCode ? 'border-red-300 focus:ring-red-200' : 'border-amber-200 focus:ring-amber-200 focus:border-amber-400'
                }`}
              />
              {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
            </div>
          </div>

          {/* Optional VIN */}
          <div className="space-y-2">
            <Label htmlFor="vin" className="text-sm font-semibold text-amber-800">
              VIN (Optional)
            </Label>
            <div className="relative">
              <Input
                id="vin"
                type="text"
                value={vin}
                onChange={handleVinChange}
                placeholder="17-character VIN (optional)"
                maxLength={17}
                className={`h-12 border-2 transition-all duration-200 pr-10 ${
                  errors.vin 
                    ? 'border-red-300 focus:ring-red-200' 
                    : isVinValid === true 
                    ? 'border-green-300 focus:ring-green-200' 
                    : 'border-amber-200 focus:ring-amber-200 focus:border-amber-400'
                }`}
              />
              {isVinValid === true && (
                <CheckCircle className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
              )}
            </div>
            {errors.vin && <p className="text-sm text-red-600">{errors.vin}</p>}
            {vin && (
              <p className="text-xs text-amber-600">
                {vin.length}/17 characters
              </p>
            )}
          </div>

          {/* Premium Features Highlight */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Premium Manual Entry Includes:
            </h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Advanced algorithmic valuation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Detailed market analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Comprehensive feature assessment
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Professional valuation report
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Market trend predictions
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold text-lg shadow-lg" 
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Premium Valuation...
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
