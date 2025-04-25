
import { Label } from '@/components/ui/label';
import { FormData } from '../PremiumValuationForm';
import { useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';

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
  // This step is valid by default (No accidents)
  useEffect(() => {
    updateValidity(step, true);
  }, []);

  const handleAccidentChange = (value: string) => {
    if (value === 'yes' || value === 'no') {
      const hasAccident = value === 'yes';
      
      setFormData(prev => ({
        ...prev,
        hasAccident,
        // Clear accident description if "No" is selected
        accidentDescription: hasAccident ? prev.accidentDescription : ''
      }));
      
      // This step is always valid regardless of selection
      updateValidity(step, true);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          
          <ToggleGroup 
            type="single" 
            value={formData.hasAccident ? 'yes' : 'no'}
            onValueChange={handleAccidentChange}
            className="justify-start"
          >
            <ToggleGroupItem value="no" className="bg-white">No</ToggleGroupItem>
            <ToggleGroupItem value="yes" className="bg-white">Yes</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {formData.hasAccident && (
          <div className="space-y-3 animate-fade-in">
            <Label htmlFor="accident-description" className="text-gray-700">
              Describe the accident(s) briefly
            </Label>
            
            <Textarea
              id="accident-description"
              value={formData.accidentDescription}
              onChange={handleDescriptionChange}
              placeholder="Please describe when the accident occurred, the severity, and any repairs made..."
              rows={4}
              className="w-full"
            />
            
            <p className="text-sm text-gray-500">
              Providing accurate details about previous accidents helps us determine how they impact your vehicle's value.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
