
import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Car, Activity, Coffee } from 'lucide-react';

interface DrivingBehaviorStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function DrivingBehaviorStep({
  step,
  formData,
  setFormData,
  updateValidity
}: DrivingBehaviorStepProps) {
  // Set default value if not present
  useEffect(() => {
    if (!formData.drivingProfile) {
      setFormData(prev => ({ ...prev, drivingProfile: 'average' }));
    }
    
    // This step is always valid as we set a default value
    updateValidity(step, true);
  }, [step, formData.drivingProfile, setFormData, updateValidity]);

  const handleDrivingProfileChange = (value: 'light' | 'average' | 'heavy') => {
    setFormData(prev => ({ ...prev, drivingProfile: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Driving Behavior</h2>
        <p className="text-gray-600 mb-6">
          Tell us about your driving habits to help refine your valuation estimate.
        </p>
      </div>

      <div className="space-y-6">
        <RadioGroup 
          value={formData.drivingProfile || 'average'} 
          onValueChange={(val) => handleDrivingProfileChange(val as 'light' | 'average' | 'heavy')}
          className="grid grid-cols-1 gap-4 pt-2"
        >
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="light" id="light" className="mt-1" />
            <div className="flex-grow">
              <Label htmlFor="light" className="flex items-center text-base font-medium cursor-pointer">
                <Coffee className="h-5 w-5 mr-2 text-blue-500" />
                Light Usage
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Weekends and occasional use. Less than 8,000 miles per year.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="average" id="average" className="mt-1" />
            <div className="flex-grow">
              <Label htmlFor="average" className="flex items-center text-base font-medium cursor-pointer">
                <Car className="h-5 w-5 mr-2 text-green-500" />
                Average Usage
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Daily commuting and regular trips. Between 8,000-15,000 miles per year.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="heavy" id="heavy" className="mt-1" />
            <div className="flex-grow">
              <Label htmlFor="heavy" className="flex items-center text-base font-medium cursor-pointer">
                <Activity className="h-5 w-5 mr-2 text-red-500" />
                Heavy Usage
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Long commutes, frequent road trips, or commercial use. More than 15,000 miles per year.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
