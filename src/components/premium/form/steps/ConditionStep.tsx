
import { Label } from '@/components/ui/label';
import { FormData } from '../PremiumValuationForm';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';
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

type ConditionLevel = 'Poor' | 'Fair' | 'Good' | 'Excellent';

interface ConditionInfo {
  label: ConditionLevel;
  description: string;
  tipText: string;
  color: string;
  range: [number, number];
}

const conditionLevels: ConditionInfo[] = [
  {
    label: 'Poor',
    description: 'Vehicle has significant mechanical or cosmetic issues, may require repairs to be operational.',
    tipText: 'Consider addressing critical mechanical issues first. Basic maintenance can increase value before selling.',
    color: 'text-red-600',
    range: [0, 25]
  },
  {
    label: 'Fair',
    description: 'Vehicle runs with some mechanical or cosmetic issues. General wear and tear evident.',
    tipText: 'A thorough detailing and minor repairs could significantly improve your valuation.',
    color: 'text-amber-500',
    range: [26, 50]
  },
  {
    label: 'Good',
    description: 'Vehicle runs well with minor issues. Regular maintenance performed, normal wear for age.',
    tipText: 'Consider professional detailing and addressing any minor cosmetic issues for maximum value.',
    color: 'text-green-600',
    range: [51, 75]
  },
  {
    label: 'Excellent',
    description: 'Vehicle in exceptional condition. Well-maintained with minimal wear, no mechanical issues.',
    tipText: 'Maintain detailed service records and continue regular maintenance to preserve top value.',
    color: 'text-blue-600',
    range: [76, 100]
  }
];

export function ConditionStep({
  step,
  formData,
  setFormData,
  updateValidity
}: ConditionStepProps) {
  // Always valid since we have a default condition value
  useEffect(() => {
    updateValidity(step, true);
  }, []);

  const handleConditionChange = (values: number[]) => {
    const condition = values[0];
    const conditionInfo = getConditionInfo(condition);
    
    setFormData(prev => ({
      ...prev,
      condition,
      conditionLabel: conditionInfo.label
    }));
  };

  const getConditionInfo = (value: number): ConditionInfo => {
    return conditionLevels.find(level => 
      value >= level.range[0] && value <= level.range[1]
    ) || conditionLevels[1]; // Default to 'Fair'
  };

  const currentCondition = getConditionInfo(formData.condition);

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
          <Label className="text-gray-700 mb-8 block">
            Overall Condition
          </Label>
          
          <div className="px-2 pt-6 pb-2">
            <Slider
              value={[formData.condition]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleConditionChange}
              className="mb-8"
            />
            
            <div className="flex justify-between mt-2 text-sm">
              {conditionLevels.map(level => (
                <TooltipProvider key={level.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`font-medium ${level.color} cursor-help`}>
                        {level.label}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs p-3">
                      <p className="font-medium">{level.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium text-gray-900">
              Current: <span className={currentCondition.color}>{currentCondition.label}</span>
            </h3>
            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
              {formData.condition}%
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {currentCondition.description}
          </p>
          
          <div className="bg-white p-3 rounded border border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Improvement Tip:</h4>
            <p className="text-sm text-gray-600">
              {currentCondition.tipText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
