import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { EnhancedVinLookup } from '@/components/premium/lookup/EnhancedVinLookup';
import { toast } from 'sonner';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { motion } from 'framer-motion';

interface VehicleIdentificationStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  lookupVehicle: (identifierType: 'vin' | 'plate' | 'manual' | 'photo', identifier: string, state?: string, manualData?: any, imageData?: any) => Promise<any>;
  isLoading: boolean;
}

export function VehicleIdentificationStep({
  step,
  formData,
  setFormData,
  updateValidity,
  lookupVehicle,
  isLoading
}: VehicleIdentificationStepProps) {
  const [state, setState] = useState<string>('');
  const [error, setError] = useState<string>('');

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
        identifier: '' // Clear identifier when changing type
      }));
      // Reset validity when changing identifier type
      updateValidity(step, false);
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
            />
          ) : formData.identifierType === 'plate' ? (
            null
          ) : null}
        </motion.div>
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
            {formData.mileage && ` • ${formData.mileage.toLocaleString()} miles`}
            {formData.fuelType && ` • ${formData.fuelType}`}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

import { Check } from 'lucide-react';
