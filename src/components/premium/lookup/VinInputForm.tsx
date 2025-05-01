import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useVinInput } from '@/hooks/useVinInput';
import { VinInput } from '@/components/premium/lookup/VinInput';
import { VinSubmitButton } from '@/components/premium/lookup/VinSubmitButton';

interface VinInputFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function VinInputForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  error
}: VinInputFormProps) {
  const {
    value: vinValue,
    touched,
    validationError,
    handleInputChange,
    isValid
  } = useVinInput({
    initialValue: value,
    onValidChange: (valid) => {
      // Keep parent component updated with changes
      if (valid !== wasValid) {
        setWasValid(valid);
      }
    }
  });

  const [wasValid, setWasValid] = useState(false);

  // Keep parent value in sync with local value
  if (value !== vinValue) {
    onChange(vinValue);
  }

  const handleSubmit = async () => {
    if (isValid && !isLoading) {
      onSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
          Recommended
        </Badge>
        <p className="text-sm text-slate-500">Fast & Accurate</p>
      </div>
      
      <VinInput
        value={vinValue}
        onChange={handleInputChange}
        validationError={validationError}
        externalError={error}
        touched={touched}
        isValid={isValid}
        isLoading={isLoading}
        onKeyPress={handleKeyPress}
      />
      
      <VinSubmitButton 
        onClick={handleSubmit}
        disabled={!isValid}
        isLoading={isLoading}
      />
    </div>
  );
}
