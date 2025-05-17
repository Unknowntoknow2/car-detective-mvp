
import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface AccidentHistoryFormProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (isValid: boolean) => void;
}

export function AccidentHistoryForm({
  step,
  formData,
  setFormData,
  updateValidity
}: AccidentHistoryFormProps) {
  useEffect(() => {
    // Convert boolean or string to boolean for validation
    const hasAccidentBool = typeof formData.hasAccident === 'string'
      ? formData.hasAccident === 'yes'
      : !!formData.hasAccident;
      
    const isValid = !hasAccidentBool || (hasAccidentBool && formData.accidentDescription?.trim() !== '');
    updateValidity(isValid);
  }, [formData.hasAccident, formData.accidentDescription, updateValidity]);

  const handleAccidentChange = (value: 'yes' | 'no') => {
    setFormData(prev => ({
      ...prev,
      hasAccident: value,
      accidentDescription: value === 'yes' ? prev.accidentDescription : ''
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      accidentDescription: e.target.value
    }));
  };

  // Convert the hasAccident value to string for RadioGroup
  const hasAccidentStr = typeof formData.hasAccident === 'boolean'
    ? formData.hasAccident ? 'yes' : 'no'
    : formData.hasAccident || 'no';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Accident History</h2>
        <p className="text-gray-600 mb-6">
          Information about previous accidents helps provide a more accurate valuation.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-gray-700 mb-3 block">
            Has this vehicle ever been in an accident?
          </Label>
          <RadioGroup
            value={hasAccidentStr}
            onValueChange={(val) => handleAccidentChange(val as 'yes' | 'no')}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="acc-no" />
              <Label htmlFor="acc-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="acc-yes" />
              <Label htmlFor="acc-yes">Yes</Label>
            </div>
          </RadioGroup>
        </div>

        {hasAccidentStr === 'yes' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-1" />
              <Label htmlFor="acc-details" className="text-gray-700">
                Please describe the accident(s)
              </Label>
            </div>
            
            <Textarea
              id="acc-details"
              placeholder="When did it occur? What was the severity? What repairs were made?"
              value={formData.accidentDescription || ''}
              onChange={handleDetailsChange}
              className="min-h-[100px]"
            />
            
            <p className="text-sm text-gray-500">
              Providing accurate details about previous accidents helps us determine their impact on the vehicle's value.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
