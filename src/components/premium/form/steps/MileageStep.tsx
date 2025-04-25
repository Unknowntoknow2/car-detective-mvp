
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData } from '@/hooks/usePremiumValuationForm';
import { useState, useEffect } from 'react';

interface MileageStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function MileageStep({
  step,
  formData,
  setFormData,
  updateValidity
}: MileageStepProps) {
  const [inputValue, setInputValue] = useState<string>(
    formData.mileage ? formData.mileage.toString() : ''
  );
  const [error, setError] = useState<string>('');

  // Initialize validity
  useEffect(() => {
    updateValidity(step, Boolean(formData.mileage));
  }, []);

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input or numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
      
      if (value === '') {
        setFormData(prev => ({ ...prev, mileage: null }));
        updateValidity(step, false);
        setError('');
      } else {
        const mileage = parseInt(value, 10);
        
        if (mileage < 0) {
          setError('Mileage cannot be negative');
          updateValidity(step, false);
        } else if (mileage > 999999) {
          setError('Mileage seems too high');
          updateValidity(step, false);
        } else {
          setFormData(prev => ({ ...prev, mileage }));
          updateValidity(step, true);
          setError('');
        }
      }
    }
  };

  // Format the mileage with commas when input loses focus
  const handleBlur = () => {
    if (inputValue) {
      const mileage = parseInt(inputValue.replace(/,/g, ''), 10);
      setInputValue(mileage.toLocaleString());
    }
  };

  // Remove commas when input gets focus for easier editing
  const handleFocus = () => {
    setInputValue(inputValue.replace(/,/g, ''));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Mileage</h2>
        <p className="text-gray-600 mb-6">
          Please enter the current mileage of your vehicle for a more accurate valuation.
        </p>
      </div>
      
      <div>
        <Label htmlFor="mileage" className="text-gray-700">
          Current Mileage <span className="text-red-500">*</span>
        </Label>
        <div className="mt-1">
          <Input
            id="mileage"
            type="text"
            value={inputValue}
            onChange={handleMileageChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="e.g. 45,000 miles"
            aria-describedby="mileage-description"
            className="w-full"
            required
          />
        </div>
        <p id="mileage-description" className="mt-2 text-sm text-gray-500">
          Enter the odometer reading in miles. A more accurate mileage leads to a more precise valuation.
        </p>
        {error && (
          <div className="text-sm font-medium text-red-600 mt-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
