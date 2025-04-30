
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/types/premium-valuation';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { Check, AlertTriangle } from 'lucide-react';

interface AccidentHistorySectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}

export function AccidentHistorySection({ formData, setFormData, errors }: AccidentHistorySectionProps) {
  const toggleAccidentHistory = (hasAccident: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasAccident,
      // Clear accident description if toggling to "No"
      ...(hasAccident === false ? { accidentDescription: '' } : {})
    }));
  };

  const handleAccidentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      accidentDescription: e.target.value
    }));
  };

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Accident History</h3>
      
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => toggleAccidentHistory(false)}
          className={`flex items-center px-4 py-2 border rounded-md ${
            formData.hasAccident === false 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Check className="w-4 h-4 mr-2" />
          No Accidents
        </button>
        
        <button
          type="button"
          onClick={() => toggleAccidentHistory(true)}
          className={`flex items-center px-4 py-2 border rounded-md ${
            formData.hasAccident === true 
              ? 'bg-amber-50 border-amber-200 text-amber-700' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Has Accident History
        </button>
      </div>
      
      {formData.hasAccident && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="accidentDescription">
            Accident Details <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="accidentDescription"
            placeholder="Please describe the accident(s), including severity, when it happened, and what parts of the vehicle were affected."
            value={formData.accidentDescription}
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
