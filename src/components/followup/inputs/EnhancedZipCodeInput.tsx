
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface EnhancedZipCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export function EnhancedZipCodeInput({ 
  value,
  onChange,
  label = "ZIP Code", 
  required = false,
  className = ""
}: EnhancedZipCodeInputProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationState, setValidationState] = useState<'valid' | 'invalid' | 'pending'>('pending');
  const [locationInfo, setLocationInfo] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and limit to 5 characters
    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 5);
    onChange(sanitized);
  };

  // Validate ZIP code with debouncing
  useEffect(() => {
    if (value.length === 5) {
      const validateZip = async () => {
        setIsValidating(true);
        setValidationState('pending');
        
        try {
          const response = await fetch(`https://api.zippopotam.us/us/${value}`);
          
          if (response.ok) {
            const data = await response.json();
            setValidationState('valid');
            setLocationInfo(`${data.places[0]['place name']}, ${data.places[0]['state abbreviation']}`);
          } else {
            setValidationState('invalid');
            setLocationInfo('');
          }
        } catch (error) {
          setValidationState('invalid');
          setLocationInfo('');
        } finally {
          setIsValidating(false);
        }
      };

      const timer = setTimeout(validateZip, 500);
      return () => clearTimeout(timer);
    } else {
      setValidationState('pending');
      setLocationInfo('');
      setIsValidating(false);
    }
  }, [value]);

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    }
    
    if (validationState === 'valid') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (validationState === 'invalid' && value.length === 5) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    return null;
  };

  const getInputClasses = () => {
    const baseClasses = "font-mono pr-10";
    
    if (validationState === 'valid') {
      return `${baseClasses} border-green-300 focus:border-green-500 focus:ring-green-200`;
    }
    
    if (validationState === 'invalid' && value.length === 5) {
      return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-200`;
    }
    
    return baseClasses;
  };

  return (
    <div className={className}>
      <Label htmlFor="zip_code" className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1 relative">
        <Input
          id="zip_code"
          type="text"
          placeholder="12345"
          maxLength={5}
          value={value}
          onChange={handleChange}
          className={getInputClasses()}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {getValidationIcon()}
        </div>
      </div>
      {locationInfo && (
        <p className="mt-1 text-sm text-green-600">{locationInfo}</p>
      )}
      {validationState === 'invalid' && value.length === 5 && (
        <p className="mt-1 text-sm text-red-600">Please enter a valid US ZIP code</p>
      )}
    </div>
  );
}
