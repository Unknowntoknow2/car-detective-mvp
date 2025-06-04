<<<<<<< HEAD

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccidentDetails } from '../types/manualEntry';
=======
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { AccidentDetails } from "../types/manualEntry";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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
<<<<<<< HEAD
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
=======
  setBodyType,
  accidentDetails,
  setAccidentDetails,
  features,
  setFeatures,
}) => {
  // Common features for the checkboxes
  const commonFeatures = [
    { id: "leather-seats", label: "Leather Seats" },
    { id: "sunroof", label: "Sunroof/Moonroof" },
    { id: "navigation", label: "Navigation System" },
    { id: "bluetooth", label: "Bluetooth" },
    { id: "backup-camera", label: "Backup Camera" },
    { id: "third-row", label: "Third Row Seating" },
    { id: "heated-seats", label: "Heated Seats" },
    { id: "apple-carplay", label: "Apple CarPlay/Android Auto" },
    { id: "premium-audio", label: "Premium Audio" },
  ];

  const handleFeatureChange = (id: string, checked: boolean) => {
    if (checked) {
      setFeatures([...features, id]);
    } else {
      setFeatures(features.filter((f) => f !== id));
    }
  };

  const toggleAccidentHistory = (checked: boolean) => {
    setAccidentDetails({
      ...accidentDetails,
      hasAccident: checked,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Additional Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trim">Trim Level (Optional)</Label>
          <Input
            id="trim"
            placeholder="e.g. XLE, Limited, Sport"
            value={trim}
            onChange={(e) => setTrim(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Exterior Color (Optional)</Label>
          <Input
            id="color"
            placeholder="e.g. Silver, Black, White"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type (Optional)</Label>
          <Input
            id="bodyType"
            placeholder="e.g. Sedan, SUV, Truck"
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="accident-history" className="cursor-pointer">
            Accident History
          </Label>
          <Switch
            id="accident-history"
            checked={accidentDetails.hasAccident}
            onCheckedChange={toggleAccidentHistory}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Disclosing accident history improves valuation accuracy
        </p>
      </div>

      <div className="space-y-2">
        <Label>Features (Optional)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {commonFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={features.includes(feature.id)}
                onCheckedChange={(checked) =>
                  handleFeatureChange(feature.id, checked as boolean)}
              />
              <Label htmlFor={feature.id} className="cursor-pointer text-sm">
                {feature.label}
              </Label>
            </div>
          ))}
        </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
