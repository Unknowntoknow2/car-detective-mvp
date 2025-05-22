
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AccidentDetails } from '@/components/lookup/types/manualEntry';

interface AccidentDetailsFormProps {
  value: AccidentDetails;
  onChange: (details: AccidentDetails) => void;
}

export function AccidentDetailsForm({ value, onChange }: AccidentDetailsFormProps) {
  const handleToggle = (checked: boolean) => {
    onChange({ ...value, hasAccidents: checked, hasAccident: checked });
  };

  const handleSeverityChange = (severity: string) => {
    onChange({ ...value, severity, accidentSeverity: severity as any });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...value, description: e.target.value });
  };

  const handleRepairedChange = (checked: boolean) => {
    onChange({ ...value, repaired: checked });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="accident-toggle"
          checked={value.hasAccidents || value.hasAccident || false}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="accident-toggle">Vehicle has been in an accident</Label>
      </div>

      {(value.hasAccidents || value.hasAccident) && (
        <div className="pl-6 space-y-4 border-l-2 border-gray-200">
          <div className="space-y-2">
            <Label>Severity</Label>
            <RadioGroup 
              value={value.severity || value.accidentSeverity || 'Minor'} 
              onValueChange={handleSeverityChange}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Minor" id="severity-minor" />
                <Label htmlFor="severity-minor">Minor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Moderate" id="severity-moderate" />
                <Label htmlFor="severity-moderate">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Severe" id="severity-severe" />
                <Label htmlFor="severity-severe">Severe</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accident-description">Description</Label>
            <Textarea
              id="accident-description"
              placeholder="Please describe the accident"
              value={value.description || ''}
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="repaired-toggle"
              checked={value.repaired || false}
              onCheckedChange={handleRepairedChange}
            />
            <Label htmlFor="repaired-toggle">Damage has been fully repaired</Label>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccidentDetailsForm;
