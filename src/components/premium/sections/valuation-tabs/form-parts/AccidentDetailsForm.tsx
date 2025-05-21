
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface AccidentDetails {
  hasAccident: boolean;
  accidentDescription?: string;
  severity?: 'minor' | 'moderate' | 'severe';
}

export interface AccidentDetailsProps {
  accidentInfo: AccidentDetails;
  setAccidentInfo: React.Dispatch<React.SetStateAction<AccidentDetails>>;
}

export function AccidentDetailsForm({
  accidentInfo,
  setAccidentInfo
}: AccidentDetailsProps) {
  const handleAccidentChange = (value: string) => {
    setAccidentInfo(prev => ({
      ...prev,
      hasAccident: value === 'yes',
      accidentDescription: value === 'no' ? undefined : prev.accidentDescription,
      severity: value === 'no' ? undefined : prev.severity
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
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3">
          <Label>Has this vehicle been in an accident?</Label>
          <RadioGroup
            value={accidentInfo.hasAccident ? 'yes' : 'no'}
            onValueChange={handleAccidentChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accident" />
              <Label htmlFor="no-accident" className="font-normal cursor-pointer">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-accident" />
              <Label htmlFor="yes-accident" className="font-normal cursor-pointer">Yes</Label>
            </div>
          </RadioGroup>
        </div>

        {accidentInfo.hasAccident && (
          <>
            <div className="space-y-3">
              <Label htmlFor="accident-description">Accident Description</Label>
              <Textarea
                id="accident-description"
                value={accidentInfo.accidentDescription || ''}
                onChange={handleDescriptionChange}
                placeholder="Please describe the accident (what happened, damage, repairs, etc.)"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label>Accident Severity</Label>
              <RadioGroup
                value={accidentInfo.severity || 'minor'}
                onValueChange={(value) => handleSeverityChange(value as 'minor' | 'moderate' | 'severe')}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minor" id="minor-severity" />
                  <Label htmlFor="minor-severity" className="font-normal cursor-pointer">Minor (cosmetic damage only)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate-severity" />
                  <Label htmlFor="moderate-severity" className="font-normal cursor-pointer">Moderate (required some mechanical repairs)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="severe-severity" />
                  <Label htmlFor="severe-severity" className="font-normal cursor-pointer">Severe (major structural or mechanical damage)</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
