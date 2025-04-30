
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usStates } from '@/data/us-states';
import { motion } from 'framer-motion';

interface EnhancedPlateFormProps {
  plateValue: string;
  stateValue: string;
  isLoading: boolean;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
}

export function EnhancedPlateForm({
  plateValue,
  stateValue,
  isLoading,
  onPlateChange,
  onStateChange,
  onSubmit,
  error
}: EnhancedPlateFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const isValid = plateValue.length >= 2 && plateValue.length <= 8 && !!stateValue;

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    
    if (newValue.length > 8) return;
    
    // Only allow alphanumeric characters
    if (/^[A-Z0-9]*$/.test(newValue) || newValue === '') {
      onPlateChange(newValue);
      setTouched(true);
      
      if (newValue.length < 2 && newValue.length > 0) {
        setValidationError('License plate must be at least 2 characters');
      } else {
        setValidationError(null);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      onSubmit();
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">License Plate</label>
          <div className="relative">
            <Input 
              value={plateValue}
              onChange={handlePlateChange}
              placeholder="Enter license plate (e.g., ABC123)"
              className={`font-mono tracking-wide uppercase h-12 px-4 text-base ${
                validationError ? 'border-red-300 focus:ring-red-200 bg-red-50/20' :
                isValid && stateValue ? 'border-green-300 focus:ring-green-200 bg-green-50/20' :
                'border-gray-300 hover:border-primary/40'
              } transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10`}
              onKeyPress={handleKeyPress}
              maxLength={8}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
          <Select 
            value={stateValue} 
            onValueChange={onStateChange}
          >
            <SelectTrigger 
              className={`w-full h-12 px-4 text-base ${
                !stateValue ? 'border-gray-300 hover:border-primary/40' : 
                'border-green-300 focus:ring-green-200 bg-green-50/20'
              } transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10`}
            >
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent className="max-h-80 overflow-y-auto border border-gray-200 shadow-lg rounded-md">
              {usStates.map((state) => (
                <SelectItem 
                  key={state.value} 
                  value={state.value}
                  className="hover:bg-primary/5 focus:bg-primary/5 cursor-pointer py-2"
                >
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {touched && validationError ? (
        <FormValidationError error={validationError} />
      ) : error ? (
        <FormValidationError error={error} />
      ) : (
        <div className="flex items-start gap-2 text-sm text-slate-500 pl-1">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-1 text-slate-400" />
          <p className="text-xs">
            Enter your vehicle's license plate and the state where it's registered.
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <motion.div
          whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
          whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
        >
          <Button
            onClick={onSubmit}
            disabled={!isValid || isLoading}
            className="px-6 py-2.5 h-11 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Looking up plate...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Look up Vehicle</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
