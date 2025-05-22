
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccidentDetails } from '../types/manualEntry';

interface AccidentDetailsFormProps {
  value: AccidentDetails;
  onChange: (details: AccidentDetails) => void;
}

export const AccidentDetailsForm: React.FC<AccidentDetailsFormProps> = ({ value, onChange }) => {
  const handleHasAccidentChange = (hasAccident: boolean) => {
    onChange({
      ...value,
      hasAccident
    });
  };

  const handleSeverityChange = (severity: 'minor' | 'moderate' | 'severe') => {
    onChange({
      ...value,
      severity
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...value,
      description: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Has this vehicle been in an accident?</Label>
        <RadioGroup 
          value={value.hasAccident ? 'yes' : 'no'} 
          onValueChange={(val) => handleHasAccidentChange(val === 'yes')}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="accident-yes" />
            <Label htmlFor="accident-yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="accident-no" />
            <Label htmlFor="accident-no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      {value.hasAccident && (
        <>
          <div>
            <Label htmlFor="accident-severity">Severity</Label>
            <Select 
              value={value.severity || 'minor'} 
              onValueChange={(val) => handleSeverityChange(val as 'minor' | 'moderate' | 'severe')}
            >
              <SelectTrigger id="accident-severity" className="w-full mt-1">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accident-description">Description (optional)</Label>
            <Textarea
              id="accident-description"
              className="mt-1"
              placeholder="Please briefly describe the accident..."
              value={value.description || ''}
              onChange={handleDescriptionChange}
            />
          </div>
        </>
      )}
    </div>
  );
};
