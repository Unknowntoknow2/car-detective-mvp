
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleFormTooltip } from '@/components/form/VehicleFormToolTip';
import { AccidentDetails } from '../types/manualEntry';

interface PremiumFieldsProps {
  trim: string;
  setTrim: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  bodyType: string;
  setBodyType: (value: string) => void;
  accidentDetails: AccidentDetails;
  setAccidentDetails: (details: AccidentDetails) => void;
  features: string[];
  setFeatures: (features: string[]) => void;
}

export const PremiumFields: React.FC<PremiumFieldsProps> = ({
  trim,
  setTrim,
  color,
  setColor,
  bodyType,
  setBodyType,
  accidentDetails,
  setAccidentDetails,
  features,
  setFeatures
}) => {
  // Function to handle accident radio change
  const handleAccidentChange = (value: string) => {
    setAccidentDetails({
      ...accidentDetails,
      hasAccident: value === 'yes'
    });
  };

  return (
    <div className="space-y-6 border-t pt-6 mt-6">
      <h3 className="text-lg font-medium">Additional Details</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trim">Trim Level</Label>
          <Input
            id="trim"
            value={trim}
            onChange={(e) => setTrim(e.target.value)}
            placeholder="e.g., SE, Limited, Sport"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g., Red, Silver, Blue"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="bodyType">Body Style</Label>
          <VehicleFormTooltip 
            content="The body style of your vehicle affects its valuation."
          />
        </div>
        <Select
          value={bodyType}
          onValueChange={setBodyType}
        >
          <SelectTrigger id="bodyType">
            <SelectValue placeholder="Select body style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Coupe">Coupe</SelectItem>
            <SelectItem value="Truck">Truck</SelectItem>
            <SelectItem value="Convertible">Convertible</SelectItem>
            <SelectItem value="Wagon">Wagon</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
            <SelectItem value="Van">Van/Minivan</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Has this vehicle been in an accident?</Label>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="accident-yes"
              name="accident"
              value="yes"
              checked={accidentDetails.hasAccident === true}
              onChange={() => handleAccidentChange('yes')}
              className="h-4 w-4 text-primary"
            />
            <Label htmlFor="accident-yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="accident-no"
              name="accident"
              value="no"
              checked={accidentDetails.hasAccident === false}
              onChange={() => handleAccidentChange('no')}
              className="h-4 w-4 text-primary"
            />
            <Label htmlFor="accident-no" className="cursor-pointer">No</Label>
          </div>
        </div>
      </div>
      
      {/* Feature selection would go here, simplified for now */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label>Premium Features</Label>
          <VehicleFormTooltip 
            content="Select premium features that your vehicle has. These can increase its value."
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Feature selection is available in the premium valuation flow.
        </p>
      </div>
    </div>
  );
};
