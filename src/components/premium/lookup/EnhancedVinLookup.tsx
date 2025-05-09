
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { validateVin } from '@/utils/validation/vin-validation';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { motion } from 'framer-motion';
import { VinInfoMessage } from '@/components/validation/VinInfoMessage';

interface EnhancedVinLookupProps {
  value: string;
  onChange: (value: string) => void;
  onLookup: () => void;
  isLoading: boolean;
  error?: string;
}

export function EnhancedVinLookup({
  value,
  onChange,
  onLookup,
  isLoading,
  error
}: EnhancedVinLookupProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  // Validate VIN when value changes
  useEffect(() => {
    if (!value) {
      setIsValid(false);
      setValidationError(null);
      return;
    }

    setTouched(true);
    
    const validation = validateVin(value);
    setIsValid(validation.valid);
    setValidationError(validation.valid ? null : validation.message || null);
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      onLookup();
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Enter VIN (e.g., 1HGCM82633A004352)"
          className={`font-mono tracking-wide h-12 px-4 text-base ${
            validationError ? 'border-red-300 focus:ring-red-200 bg-red-50/20' :
            isValid ? 'border-green-300 focus:ring-green-200 bg-green-50/20' :
            'border-gray-300 hover:border-primary/40'
          } transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10`}
          onKeyPress={handleKeyPress}
        />
        
        {isValid && !isLoading && (
          <motion.div 
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </motion.div>
        )}
      </div>
      
      {touched && validationError ? (
        <FormValidationError error={validationError} />
      ) : error ? (
        <FormValidationError error={error} />
      ) : (
        <VinInfoMessage />
      )}
      
      <div className="flex justify-end">
        <motion.div
          whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
          whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
        >
          <Button
            onClick={onLookup}
            disabled={!isValid || isLoading}
            className="px-6 py-2.5 h-11 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Looking up VIN...</span>
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
