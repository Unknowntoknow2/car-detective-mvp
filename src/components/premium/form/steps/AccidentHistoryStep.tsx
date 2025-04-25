
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/types/premium-valuation';
import { AlertTriangle } from 'lucide-react';

interface AccidentHistoryStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function AccidentHistoryStep({
  step,
  formData,
  setFormData,
  updateValidity
}: AccidentHistoryStepProps) {
  useEffect(() => {
    const isValid = !formData.hasAccident || (formData.hasAccident && formData.accidentDescription.trim() !== '');
    updateValidity(step, isValid);
  }, [formData.hasAccident, formData.accidentDescription, step, updateValidity]);

  const handleAccidentChange = (value: string) => {
    const hasAccident = value === "true";
    setFormData(prev => ({
      ...prev,
      hasAccident,
      accidentDescription: hasAccident ? prev.accidentDescription : ''
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      accidentDescription: e.target.value
    }));
  };

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
            value={String(formData.hasAccident)}
            onValueChange={handleAccidentChange}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="acc-no" />
              <Label htmlFor="acc-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="acc-yes" />
              <Label htmlFor="acc-yes">Yes</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.hasAccident && (
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
              value={formData.accidentDescription}
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
