
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import ErrorMessage from '@/components/ui/ErrorMessage';

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
  const hasError = (touched && validationError) || externalError;
  const showSuccessIcon = isValid && !isLoading && !hasError;
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input 
          value={value}
          onChange={onChange}
          placeholder="Enter VIN (e.g., 1HGCM82633A004352)" 
          className={`text-lg font-mono tracking-wide h-12`}
          error={Boolean(hasError)}
          onKeyPress={onKeyPress}
          trailingIcon={showSuccessIcon ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : undefined}
        />
      </div>
      
      {touched && validationError ? (
        <ErrorMessage message={validationError} />
      ) : externalError ? (
        <ErrorMessage message={externalError} />
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
