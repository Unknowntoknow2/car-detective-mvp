
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AccidentHistoryFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity: (step: number, isValid: boolean) => void;
  goToNextStep: () => void;
  step: number;
}

export function AccidentHistoryForm({
  formData,
  setFormData,
  updateStepValidity,
  goToNextStep,
  step
}: AccidentHistoryFormProps) {
  // Initialize validity
  useEffect(() => {
    // Convert hasAccident to boolean for validation
    const hasAccidentBool = formData.hasAccident === 'yes';
    const isValid = !hasAccidentBool || (hasAccidentBool && formData.accidentDescription?.trim() !== '');
    updateStepValidity(step, isValid);
  }, [formData.hasAccident, formData.accidentDescription, step, updateStepValidity]);

  const handleAccidentChange = (value: 'yes' | 'no') => {
    setFormData(prev => ({
      ...prev,
      hasAccident: value,
      // Clear description if setting to "no"
      ...(value === 'no' ? { accidentDescription: '' } : {})
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Accident History</h2>
        <p className="text-gray-600 mb-6">
          Information about previous accidents helps provide a more accurate valuation. 
          Vehicles without accident history typically maintain 15-20% higher resale value.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg text-gray-700">
            Has this vehicle been in an accident?
          </Label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer hover:border-primary transition-colors ${
                formData.hasAccident === 'no' ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => handleAccidentChange('no')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <RadioGroupItem 
                  value="no" 
                  id="no-accident" 
                  className="h-5 w-5"
                  checked={formData.hasAccident === 'no'}
                />
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                  <div>
                    <Label htmlFor="no-accident" className="font-medium">No accident history</Label>
                    <p className="text-sm text-gray-500">The vehicle has not been in any accidents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer hover:border-primary transition-colors ${
                formData.hasAccident === 'yes' ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => handleAccidentChange('yes')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <RadioGroupItem 
                  value="yes" 
                  id="yes-accident" 
                  className="h-5 w-5"
                  checked={formData.hasAccident === 'yes'}
                />
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  <div>
                    <Label htmlFor="yes-accident" className="font-medium">Has accident history</Label>
                    <p className="text-sm text-gray-500">The vehicle has been in one or more accidents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {formData.hasAccident === 'yes' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <Label htmlFor="accident-details" className="text-gray-700 font-medium">
              Please describe the accident(s) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="accident-details"
              placeholder="When did it occur? What was the severity? What parts of the vehicle were affected? Were repairs made?"
              value={formData.accidentDescription || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                accidentDescription: e.target.value
              }))}
              className="min-h-[120px]"
            />
            <p className="text-sm text-gray-500">
              Providing accurate details about previous accidents helps us determine their impact on the vehicle's value.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800 mt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Important:</p>
                  <p>Accident history can reduce a vehicle's value by approximately 5-20% depending on severity.
                  Being accurate and transparent helps you get the most reliable valuation.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end pt-6">
        <Button 
          onClick={goToNextStep}
          disabled={formData.hasAccident === 'yes' && !formData.accidentDescription?.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
