
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccidentDetails } from '../types/manualEntry';

interface PremiumFieldsProps {
  accidentDetails?: AccidentDetails;
  onAccidentDetailsChange: (details: AccidentDetails) => void;
  bodyType: string;
  onBodyTypeChange: (bodyType: string) => void;
  drivingProfile: string;
  onDrivingProfileChange: (profile: string) => void;
}

export const PremiumFields: React.FC<PremiumFieldsProps> = ({
  accidentDetails = { hasAccident: false },
  onAccidentDetailsChange,
  bodyType,
  onBodyTypeChange,
  drivingProfile,
  onDrivingProfileChange
}) => {
  const handleHasAccidentChange = (hasAccident: boolean) => {
    onAccidentDetailsChange({
      ...accidentDetails,
      hasAccident
    });
  };

  const handleSeverityChange = (severity: 'minor' | 'moderate' | 'severe') => {
    onAccidentDetailsChange({
      ...accidentDetails,
      severity
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAccidentDetailsChange({
      ...accidentDetails,
      description: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Body Type</Label>
        <Select value={bodyType} onValueChange={onBodyTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select body type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
            <SelectItem value="coupe">Coupe</SelectItem>
            <SelectItem value="convertible">Convertible</SelectItem>
            <SelectItem value="wagon">Wagon</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="hatchback">Hatchback</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Driving Profile</Label>
        <Select value={drivingProfile} onValueChange={onDrivingProfileChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select driving profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light (less than 10,000 miles/year)</SelectItem>
            <SelectItem value="average">Average (10,000-15,000 miles/year)</SelectItem>
            <SelectItem value="heavy">Heavy (more than 15,000 miles/year)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 border-t pt-4">
        <Label>Has this vehicle been in an accident?</Label>
        <RadioGroup 
          value={accidentDetails.hasAccident ? 'yes' : 'no'} 
          onValueChange={(val) => handleHasAccidentChange(val === 'yes')}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="premium-accident-yes" />
            <Label htmlFor="premium-accident-yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="premium-accident-no" />
            <Label htmlFor="premium-accident-no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      {accidentDetails.hasAccident && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
          <div>
            <Label htmlFor="premium-accident-severity">Severity</Label>
            <Select 
              value={accidentDetails.severity || 'minor'} 
              onValueChange={(val) => handleSeverityChange(val as 'minor' | 'moderate' | 'severe')}
            >
              <SelectTrigger id="premium-accident-severity" className="w-full mt-1">
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
            <Label htmlFor="premium-accident-description">Description (optional)</Label>
            <Textarea
              id="premium-accident-description"
              className="mt-1"
              placeholder="Please briefly describe the accident..."
              value={accidentDetails.description || ''}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
