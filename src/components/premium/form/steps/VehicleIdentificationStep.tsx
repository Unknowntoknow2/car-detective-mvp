
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Check, Car, ArrowRight } from 'lucide-react';
import { EnhancedVinLookup } from '@/components/premium/lookup/EnhancedVinLookup';
import { toast } from 'sonner';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface VehicleIdentificationStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  lookupVehicle: (identifierType: 'vin' | 'plate' | 'manual' | 'photo', identifier: string, state?: string, manualData?: any, imageData?: any) => Promise<any>;
  isLoading: boolean;
  goToNextStep: () => void;
}

export function VehicleIdentificationStep({
  step,
  formData,
  setFormData,
  updateValidity,
  lookupVehicle,
  isLoading,
  goToNextStep
}: VehicleIdentificationStepProps) {
  const [state, setState] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [hasExistingVehicle, setHasExistingVehicle] = useState<boolean>(false);

  useEffect(() => {
    // Check if we already have vehicle information
    if (formData.make && formData.model && formData.year > 0) {
      setHasExistingVehicle(true);
      updateValidity(step, true);
    } else {
      setHasExistingVehicle(false);
    }
  }, [formData.make, formData.model, formData.year, step, updateValidity]);

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, identifier: value }));
    
    // Clean up any previous error
    if (error) setError('');
    
    // For VIN, we can validate length as user types
    if (formData.identifierType === 'vin') {
      updateValidity(step, value.length === 17);
    } else if (formData.identifierType === 'plate') {
      updateValidity(step, value.length >= 2 && value.length <= 8 && state.length > 0);
    } else {
      updateValidity(step, false);
    }
  };

  const handleTypeChange = (value: string) => {
    if (value === 'vin' || value === 'plate') {
      setFormData(prev => ({ 
        ...prev, 
        identifierType: value as 'vin' | 'plate',
        identifier: hasExistingVehicle && value === 'vin' && prev.vin ? prev.vin : '' // Keep VIN if available
      }));
      
      // Reset validity when changing identifier type
      if (!hasExistingVehicle) {
        updateValidity(step, false);
      }
      
      // Reset any errors
      setError('');
    }
  };

  const handleStateChange = (value: string) => {
    setState(value);
    // Update validity for plate lookup
    if (formData.identifierType === 'plate') {
      updateValidity(step, formData.identifier.length >= 2 && formData.identifier.length <= 8 && value.length > 0);
    }
  };

  const handleFindVehicle = async () => {
    if (formData.identifierType === 'vin') {
      if (formData.identifier.length !== 17) {
        setError('VIN must be 17 characters long');
        return;
      }
    } else if (formData.identifierType === 'plate' && !state) {
      setError('Please select a state for plate lookup');
      return;
    }
    
    try {
      setError('');
      const result = await lookupVehicle(formData.identifierType, formData.identifier, state);
      
      if (!result) {
        setError(formData.identifierType === 'vin' 
          ? 'Vehicle not found with this VIN. Please check and try again.' 
          : 'Vehicle not found with this plate. Please check and try again.');
      } else {
        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
        updateValidity(step, true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup vehicle');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // If we already have vehicle data, show a simplified continue UI
  if (hasExistingVehicle) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
          <p className="text-gray-600 mb-6">
            We already have your vehicle details. You can continue with this vehicle or change it.
          </p>
        </div>
        
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Car className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {formData.year} {formData.make} {formData.model}
                </h3>
                <p className="text-gray-600">
                  {formData.trim && `${formData.trim} • `}
                  {formData.bodyType && `${formData.bodyType} • `}
                  {formData.transmission && `${formData.transmission} • `}
                  {formData.drivetrain}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={() => setHasExistingVehicle(false)}
          >
            Change Vehicle
          </Button>
          
          <Button onClick={goToNextStep}>
            Continue to Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Identification</h2>
        <p className="text-gray-600 mb-6">
          Enter your vehicle's VIN or license plate to quickly look up your vehicle information.
        </p>
      </motion.div>
      
      <motion.div className="space-y-4" variants={item}>
        <div>
          <Label htmlFor="identifierType" className="text-sm font-medium text-gray-700">Lookup Method</Label>
          <Select 
            value={formData.identifierType} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-full mt-1.5 h-11 px-4 text-base bg-white border border-gray-300 hover:border-primary/50 focus:border-primary transition-all duration-200">
              <SelectValue placeholder="Select lookup method" />
            </SelectTrigger>
            <SelectContent className="border border-gray-200 shadow-lg rounded-md">
              <SelectItem value="vin" className="hover:bg-primary/5 focus:bg-primary/5 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">
                    <Search className="h-4 w-4" />
                  </span>
                  <span>Vehicle Identification Number (VIN)</span>
                </div>
              </SelectItem>
              <SelectItem value="plate" className="hover:bg-primary/5 focus:bg-primary/5 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full">
                    <Search className="h-4 w-4" />
                  </span>
                  <span>License Plate</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <motion.div className="space-y-3" variants={item}>
          {formData.identifierType === 'vin' ? (
            <EnhancedVinLookup
              value={formData.identifier}
              onChange={handleInputChange}
              onLookup={handleFindVehicle}
              isLoading={isLoading}
              error={error}
              existingVehicle={formData}
            />
          ) : formData.identifierType === 'plate' ? (
            null // Would implement plate lookup component here
          ) : null}
        </motion.div>
      </motion.div>
      
      <motion.div variants={item} className="pt-4">
        <Button 
          onClick={handleFindVehicle}
          disabled={isLoading || !formData.identifier || 
            (formData.identifierType === 'vin' && formData.identifier.length !== 17) ||
            (formData.identifierType === 'plate' && (!formData.identifier || !state))}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking up vehicle...
            </>
          ) : (
            "Look up Vehicle"
          )}
        </Button>
      </motion.div>
      
      {formData.make && formData.model && formData.year > 0 && (
        <motion.div 
          className="bg-green-50 border border-green-200 rounded-md p-4 mt-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-sm font-medium text-green-800 flex items-center gap-2">
            <span className="flex items-center justify-center h-5 w-5 bg-green-600 text-white rounded-full">
              <Check className="h-3 w-3" />
            </span>
            Vehicle Found
          </h3>
          <p className="mt-1 text-sm text-green-700">
            {formData.year} {formData.make} {formData.model}
            {formData.trim && ` • ${formData.trim}`}
            {formData.mileage && ` • ${formData.mileage.toLocaleString()} miles`}
            {formData.fuelType && ` • ${formData.fuelType}`}
          </p>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-green-700 hover:text-green-800 hover:bg-green-100"
            onClick={goToNextStep}
          >
            Continue to Next Step
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
