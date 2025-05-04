
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FormData } from '@/types/premium-valuation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConditionStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

const conditionLabels = ['Poor', 'Fair', 'Good', 'Excellent'] as const;
const conditionTips = {
  Poor: 'Vehicle has significant mechanical or cosmetic issues, may require repairs to be operational.',
  Fair: 'Vehicle runs with some mechanical or cosmetic issues. General wear and tear evident.',
  Good: 'Vehicle runs well with minor issues. Regular maintenance performed, normal wear for age.',
  Excellent: 'Vehicle in exceptional condition. Well-maintained with minimal wear, no mechanical issues.'
};

export function ConditionStep({
  step,
  formData,
  setFormData,
  updateValidity
}: ConditionStepProps) {
  useEffect(() => {
    // Convert to number to compare, then check if it's valid
    const conditionValue = formData.condition ? Number(formData.condition) : 0;
    updateValidity(step, conditionValue >= 0);
  }, []);

  const handleConditionChange = (value: number[]) => {
    const condition = value[0];
    const normalizedValue = Math.round((condition / 100) * (conditionLabels.length - 1));
    const label = conditionLabels[normalizedValue];
    
    setFormData(prev => ({
      ...prev,
      condition: condition.toString(), // Store as string
      conditionLabel: label
    }));
    updateValidity(step, true);
  };

  const getCurrentConditionIndex = () => {
    // Convert to number for calculation, then get the index
    const conditionValue = formData.condition ? Number(formData.condition) : 0;
    return Math.round((conditionValue / 100) * (conditionLabels.length - 1));
  };

  const currentLabel = conditionLabels[getCurrentConditionIndex()];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Condition</h2>
        <p className="text-gray-600 mb-6">
          Rate the overall condition of your vehicle for a more accurate valuation.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <Label className="text-gray-700 mb-8 block">Overall Condition</Label>
          
          <div className="px-2">
            <Slider
              value={formData.condition ? [Number(formData.condition)] : [0]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleConditionChange}
              className="mb-8"
            />
            
            <div className="flex justify-between mt-2">
              <TooltipProvider>
                {conditionLabels.map((label) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <span className={`cursor-help font-medium ${
                        label === currentLabel 
                          ? 'text-primary' 
                          : 'text-gray-500'
                      }`}>
                        {label}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs p-3">
                      <p>{conditionTips[label]}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium text-gray-900">
              Current: <span className="text-primary">{currentLabel}</span>
            </h3>
            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
              {formData.condition ? Number(formData.condition) : 0}%
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {conditionTips[currentLabel]}
          </p>
          
          <div className="bg-white p-3 rounded border border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Improvement Tip:</h4>
            <p className="text-sm text-gray-600">
              {formData.condition && Number(formData.condition) < 50 
                ? "Consider addressing critical mechanical issues first. Basic maintenance can increase value before selling."
                : "Continue regular maintenance and keep detailed service records to maintain optimal value."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
