
import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import ConditionSelectorBar from '@/components/common/ConditionSelectorBar';
import { HelpCircle } from 'lucide-react';

interface ConditionStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function ConditionStep({
  step,
  formData,
  setFormData,
  updateValidity
}: ConditionStepProps) {
  // Set default if not specified
  useEffect(() => {
    if (!formData.condition) {
      setFormData(prev => ({ ...prev, condition: ConditionLevel.Good, conditionLabel: 'Good' }));
    }
    
    // This step is always valid as we set a default
    updateValidity(step, true);
  }, [step, formData.condition, setFormData, updateValidity]);

  const handleConditionChange = (value: ConditionLevel) => {
    // Map condition values to labels
    const labelMap: Record<ConditionLevel, 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor'> = {
      [ConditionLevel.Excellent]: 'Excellent',
      [ConditionLevel.VeryGood]: 'Very Good',
      [ConditionLevel.Good]: 'Good',
      [ConditionLevel.Fair]: 'Fair',
      [ConditionLevel.Poor]: 'Poor'
    };
    
    setFormData(prev => ({
      ...prev,
      condition: value,
      conditionLabel: labelMap[value]
    }));
  };

  // Convert string condition to ConditionLevel if needed
  const currentCondition = Object.values(ConditionLevel).includes(formData.condition as ConditionLevel) 
    ? formData.condition as ConditionLevel 
    : ConditionLevel.Good;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Condition</h2>
        <p className="text-gray-600 mb-6">
          Accurately rating your vehicle's condition helps provide a more precise valuation.
        </p>
      </div>

      <div>
        <ConditionSelectorBar
          value={currentCondition}
          onChange={handleConditionChange}
        />
      </div>

      <div className="flex items-center justify-center mt-4 p-3 bg-blue-50 rounded-md">
        <HelpCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Vehicle condition has one of the largest impacts on valuation. Be honest for the most accurate result.
        </p>
      </div>
    </div>
  );
}
