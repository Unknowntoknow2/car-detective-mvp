import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVinInput } from '@/hooks/useVinInput';
import { CircleAlert } from 'lucide-react';

interface VinInputFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  className?: string;
}

export function VinInputForm({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading = false,
  className = ''
}: VinInputFormProps) {
  const { 
    vin,
    setVin, 
    isValid, 
    error,
    touched,
    validationError,
    handleInputChange,
    validateVin
  } = useVinInput();

  // Keep the local state and the parent state in sync
  React.useEffect(() => {
    if (value !== vin) {
      setVin(value);
    }
  }, [value, vin, setVin]);

  // Notify parent of changes
  React.useEffect(() => {
    if (vin !== null && vin !== value) {
      onChange(vin);
    }
  }, [vin, onChange, value]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <div className="relative">
          <Input
            placeholder="Enter 17-digit VIN number"
            value={vin || ''}
            onChange={handleInputChange}
            className={`pr-12 ${validationError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            maxLength={17}
          />
          {touched && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {validationError ? (
                <CircleAlert className="h-5 w-5 text-destructive" />
              ) : isValid ? (
                <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                  ✓
                </div>
              ) : null}
            </div>
          )}
        </div>
        {validationError && touched && (
          <p className="text-sm text-destructive mt-1">{validationError}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={!isValid || isLoading}
        className="w-full"
      >
        {isLoading ? 'Loading...' : 'Lookup Vehicle'}
      </Button>
    </form>
  );
}
