<<<<<<< HEAD

import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import ConditionSelectorBar from '@/components/common/ConditionSelectorBar';
import { HelpCircle } from 'lucide-react';
=======
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FormData } from "@/types/premium-valuation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface ConditionStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

<<<<<<< HEAD
=======
const conditionLabels = ["Poor", "Fair", "Good", "Excellent"] as const;
const conditionTips = {
  Poor:
    "Vehicle has significant mechanical or cosmetic issues, may require repairs to be operational.",
  Fair:
    "Vehicle runs with some mechanical or cosmetic issues. General wear and tear evident.",
  Good:
    "Vehicle runs well with minor issues. Regular maintenance performed, normal wear for age.",
  Excellent:
    "Vehicle in exceptional condition. Well-maintained with minimal wear, no mechanical issues.",
};

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
export function ConditionStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: ConditionStepProps) {
  // Set default if not specified
  useEffect(() => {
    if (!formData.condition) {
      setFormData(prev => ({ ...prev, condition: ConditionLevel.Good, conditionLabel: 'Good' }));
    }
    
    // This step is always valid as we set a default
    updateValidity(step, true);
  }, [step, formData.condition, setFormData, updateValidity]);

<<<<<<< HEAD
  const handleConditionChange = (value: ConditionLevel) => {
    // Map condition values to labels
    const labelMap: Record<string, 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor'> = {
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
=======
  const handleConditionChange = (value: number[]) => {
    const condition = value[0];
    const normalizedValue = Math.round(
      (condition / 100) * (conditionLabels.length - 1),
    );
    const label = conditionLabels[normalizedValue];

    setFormData((prev) => ({
      ...prev,
      condition: condition.toString(), // Store as string
      conditionLabel: label,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vehicle Condition
        </h2>
        <p className="text-gray-600 mb-6">
<<<<<<< HEAD
          Accurately rating your vehicle's condition helps provide a more precise valuation.
        </p>
      </div>

      <div>
        <ConditionSelectorBar
          value={formData.condition || ConditionLevel.Good}
          onChange={handleConditionChange}
        />
      </div>

      <div className="flex items-center justify-center mt-4 p-3 bg-blue-50 rounded-md">
        <HelpCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Vehicle condition has one of the largest impacts on valuation. Be honest for the most accurate result.
        </p>
=======
          Rate the overall condition of your vehicle for a more accurate
          valuation.
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
                      <span
                        className={`cursor-help font-medium ${
                          label === currentLabel
                            ? "text-primary"
                            : "text-gray-500"
                        }`}
                      >
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
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Improvement Tip:
            </h4>
            <p className="text-sm text-gray-600">
              {formData.condition && Number(formData.condition) < 50
                ? "Consider addressing critical mechanical issues first. Basic maintenance can increase value before selling."
                : "Continue regular maintenance and keep detailed service records to maintain optimal value."}
            </p>
          </div>
        </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    </div>
  );
}
