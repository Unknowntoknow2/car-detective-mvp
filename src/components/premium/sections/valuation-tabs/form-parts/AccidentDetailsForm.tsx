
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface AccidentDetails {
  hasAccident: boolean;
  accidentDescription?: string;
  severity?: 'minor' | 'moderate' | 'severe';
}

export interface AccidentDetailsFormProps {
  accidentInfo: AccidentDetails;
  setAccidentInfo: React.Dispatch<React.SetStateAction<AccidentDetails>>;
}

export function AccidentDetailsForm({ accidentInfo, setAccidentInfo }: AccidentDetailsFormProps) {
  const handleAccidentChange = (value: string) => {
    const hasAccident = value === 'yes';
    setAccidentInfo(prev => ({
      ...prev,
      hasAccident,
      // Reset description if no accident
      accidentDescription: hasAccident ? prev.accidentDescription : ''
    }));
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAccidentInfo(prev => ({
      ...prev,
      accidentDescription: e.target.value
    }));
  };
  
  const handleSeverityChange = (value: 'minor' | 'moderate' | 'severe') => {
    setAccidentInfo(prev => ({
      ...prev,
      severity: value
    }));
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Has this vehicle been in an accident?</h4>
        <RadioGroup 
          value={accidentInfo.hasAccident ? 'yes' : 'no'}
          onValueChange={handleAccidentChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no-accident" />
            <Label htmlFor="no-accident">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes-accident" />
            <Label htmlFor="yes-accident">Yes</Label>
          </div>
        </RadioGroup>
      </div>
      
      {accidentInfo.hasAccident && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="severity">Accident Severity</Label>
            <Select 
              value={accidentInfo.severity || 'minor'} 
              onValueChange={(value: any) => handleSeverityChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor (cosmetic damage only)</SelectItem>
                <SelectItem value="moderate">Moderate (required repairs)</SelectItem>
                <SelectItem value="severe">Severe (structural damage)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accident-description">Brief Description</Label>
            <Textarea
              id="accident-description"
              placeholder="Describe the accident (optional)"
              value={accidentInfo.accidentDescription || ''}
              onChange={handleDescriptionChange}
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
