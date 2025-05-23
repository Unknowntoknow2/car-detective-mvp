
import React from 'react';
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface VinInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationError: string | null;
  externalError?: string | null;
  touched: boolean;
  isValid: boolean;
  isLoading: boolean;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export function VinInput({
  value,
  onChange,
  validationError,
  externalError,
  touched,
  isValid,
  isLoading,
  onKeyPress
}: VinInputProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input 
          value={value}
          onChange={onChange}
          placeholder="Enter VIN (e.g., 1HGCM82633A004352)" 
          className={`text-lg font-mono tracking-wide h-12 pr-10 ${
            (touched && validationError) ? 'border-red-500 focus-visible:ring-red-500' : 
            (isValid) ? 'border-green-500 focus-visible:ring-green-500' : ''
          }`}
          onKeyPress={onKeyPress}
        />
        {isValid && !isLoading && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
      </div>
      
      {touched && validationError ? (
        <FormValidationError error={validationError} />
      ) : externalError ? (
        <FormValidationError error={externalError} />
      ) : (
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
