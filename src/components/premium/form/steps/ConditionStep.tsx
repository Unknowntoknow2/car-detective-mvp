
import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, HelpCircle, XCircle } from 'lucide-react';

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
      setFormData(prev => ({ ...prev, condition: 'good', conditionLabel: 'Good' }));
    }
    
    // This step is always valid as we set a default
    updateValidity(step, true);
  }, [step, formData.condition, setFormData, updateValidity]);

  const handleConditionChange = (value: 'excellent' | 'good' | 'fair' | 'poor') => {
    // Map condition values to labels
    const labelMap: Record<string, 'Excellent' | 'Good' | 'Fair' | 'Poor'> = {
      'excellent': 'Excellent',
      'good': 'Good',
      'fair': 'Fair',
      'poor': 'Poor'
    };
    
    setFormData(prev => ({
      ...prev,
      condition: value,
      conditionLabel: labelMap[value]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Condition</h2>
        <p className="text-gray-600 mb-6">
          Accurately rating your vehicle's condition helps provide a more precise valuation.
        </p>
      </div>

      <div>
        <RadioGroup 
          value={formData.condition || 'good'} 
          onValueChange={(val) => handleConditionChange(val as 'excellent' | 'good' | 'fair' | 'poor')}
          className="grid grid-cols-1 gap-4 pt-2"
        >
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="excellent" id="excellent" className="mt-1" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <Label htmlFor="excellent" className="flex items-center text-base font-medium cursor-pointer">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Excellent
                </Label>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">+10-15%</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Like new condition. No visible wear and tear. All features work perfectly.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="good" id="good" className="mt-1" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <Label htmlFor="good" className="flex items-center text-base font-medium cursor-pointer">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Good
                </Label>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Base Value</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Minor cosmetic defects. All mechanical components work properly.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="fair" id="fair" className="mt-1" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <Label htmlFor="fair" className="flex items-center text-base font-medium cursor-pointer">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                  Fair
                </Label>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">-10-15%</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Noticeable cosmetic defects. May need minor repairs but drives well.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="poor" id="poor" className="mt-1" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <Label htmlFor="poor" className="flex items-center text-base font-medium cursor-pointer">
                  <XCircle className="h-5 w-5 mr-2 text-red-500" />
                  Poor
                </Label>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">-20-30%</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Significant cosmetic and/or mechanical issues. Requires repairs to function properly.
              </p>
            </div>
          </div>
        </RadioGroup>
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
