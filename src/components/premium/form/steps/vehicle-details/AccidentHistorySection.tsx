
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/types/premium-valuation';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { AccidentToggle } from './AccidentToggle';

interface AccidentHistorySectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}

export function AccidentHistorySection({ formData, setFormData, errors }: AccidentHistorySectionProps) {
  const toggleAccidentHistory = (value: string) => {
    const hasAccident = value as 'yes' | 'no';
    setFormData(prev => ({
      ...prev,
      hasAccident,
      // Clear accident description if toggling to "no"
      ...(hasAccident === 'no' ? { accidentDescription: '' } : {})
    }));
  };

  const handleAccidentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      accidentDescription: e.target.value
    }));
  };

  // Convert hasAccident to string for passing to AccidentToggle
  const hasAccidentValue = typeof formData.hasAccident === 'boolean'
    ? formData.hasAccident ? 'yes' : 'no'
    : formData.hasAccident || 'no';

  // Convert to string for comparison
  const hasAccidentStr = typeof formData.hasAccident === 'boolean'
    ? formData.hasAccident ? 'yes' : 'no'
    : formData.hasAccident || 'no';

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Accident History</h3>
      
      <AccidentToggle 
        hasAccident={hasAccidentValue} 
        onToggle={toggleAccidentHistory} 
      />
      
      {hasAccidentStr === 'yes' && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="accidentDescription">
            Accident Details <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="accidentDescription"
            placeholder="Please describe the accident(s), including severity, when it happened, and what parts of the vehicle were affected."
            value={formData.accidentDescription || ''}
            onChange={handleAccidentDescriptionChange}
            className={errors.accidentDescription ? "border-red-500" : ""}
            rows={4}
          />
          {errors.accidentDescription && <FormValidationError error={errors.accidentDescription} />}
          <p className="text-sm text-gray-500">
            Providing accurate accident details helps ensure a more precise valuation
          </p>
        </div>
      )}
    </div>
  );
}
