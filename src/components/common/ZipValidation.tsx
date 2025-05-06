
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export interface ZipValidationProps {
  zip: string;
  onValidChange?: (isValid: boolean) => void;
  compact?: boolean;
  className?: string;
}

export function ZipValidation({ zip, onValidChange, compact = false, className = '' }: ZipValidationProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [location, setLocation] = useState<{ city?: string; state?: string } | null>(null);

  useEffect(() => {
    if (zip?.length === 5) {
      validateZip(zip);
    } else {
      setIsValid(null);
      setLocation(null);
      if (onValidChange) onValidChange(false);
    }
  }, [zip]);

  const validateZip = async (zipCode: string) => {
    setIsValidating(true);
    
    try {
      // Mock validation for now - in a real app this would call an API
      const isValidZip = /^\d{5}$/.test(zipCode);
      const delay = Math.random() * 500 + 300; // Simulate network delay
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      setIsValid(isValidZip);
      
      if (isValidZip) {
        // Mock location data based on zip - in a real app this would come from API
        const mockCities = ['San Francisco', 'Los Angeles', 'New York', 'Chicago', 'Miami'];
        const mockStates = ['CA', 'NY', 'IL', 'FL', 'TX'];
        
        setLocation({
          city: mockCities[parseInt(zipCode) % mockCities.length],
          state: mockStates[parseInt(zipCode) % mockStates.length]
        });
        if (onValidChange) onValidChange(true);
      } else {
        setLocation(null);
        if (onValidChange) onValidChange(false);
      }
    } catch (error) {
      console.error("Error validating ZIP:", error);
      setIsValid(false);
      setLocation(null);
      if (onValidChange) onValidChange(false);
    } finally {
      setIsValidating(false);
    }
  };

  if (!zip || zip.length < 5) return null;

  if (compact) {
    return (
      <div className={`flex items-center h-4 mt-1 ${className}`}>
        {isValidating ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : isValid ? (
          <span className="text-xs text-green-600 flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Valid
          </span>
        ) : (
          <span className="text-xs text-red-500 flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Invalid ZIP
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`mt-2 ${className}`}>
      {isValidating ? (
        <div className="flex items-center text-sm text-gray-500">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Validating ZIP code...
        </div>
      ) : isValid ? (
        <div className="text-sm text-green-600">
          <p className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Valid ZIP code for {location?.city}, {location?.state}
          </p>
        </div>
      ) : isValid === false ? (
        <div className="text-sm text-red-500">
          <p className="flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            Invalid ZIP code
          </p>
        </div>
      ) : null}
    </div>
  );
}
