
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
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
    { id: "premium-audio", label: "Premium Audio" }
  ];
  
  const handleFeatureChange = (id: string, checked: boolean) => {
    if (checked) {
      setFeatures([...features, id]);
    } else {
      setFeatures(features.filter(f => f !== id));
    }
  };
  
  const toggleAccidentHistory = (checked: boolean) => {
    setAccidentDetails({
      ...accidentDetails,
      hasAccidents: checked,
      hasAccident: checked
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
            checked={accidentDetails.hasAccidents || accidentDetails.hasAccident || false}
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
                  handleFeatureChange(feature.id, checked as boolean)
                }
              />
              <Label htmlFor={feature.id} className="cursor-pointer text-sm">
                {feature.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumFields;
