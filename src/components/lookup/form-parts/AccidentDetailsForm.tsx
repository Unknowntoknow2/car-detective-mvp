
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AccidentDetailsFormProps {
  accidentCount?: number;
  accidentLocation?: string;
  accidentSeverity?: 'minor' | 'moderate' | 'severe';
  accidentDescription?: string;
  onAccidentCountChange: (count: number) => void;
  onAccidentLocationChange: (location: string) => void;
  onAccidentSeverityChange: (severity: string) => void;
  onAccidentDescriptionChange: (description: string) => void;
}

export function AccidentDetailsForm({
  accidentCount,
  accidentLocation,
  accidentSeverity,
  accidentDescription,
  onAccidentCountChange,
  onAccidentLocationChange,
  onAccidentSeverityChange,
  onAccidentDescriptionChange,
}: AccidentDetailsFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Accident Details</h4>
      
      <div>
        <Label htmlFor="accidentCount">Number of Accidents</Label>
        <Input
          type="number"
          id="accidentCount"
          value={accidentCount || 0}
          onChange={(e) => onAccidentCountChange(parseInt(e.target.value) || 0)}
          placeholder="0"
        />
      </div>
      
      <div>
        <Label htmlFor="accidentLocation">Location of Damage</Label>
        <Input
          type="text"
          id="accidentLocation"
          value={accidentLocation || ''}
          onChange={(e) => onAccidentLocationChange(e.target.value)}
          placeholder="e.g., Front bumper, rear quarter panel"
        />
      </div>
      
      <div>
        <Label htmlFor="accidentSeverity">Severity</Label>
        <Select value={accidentSeverity || 'minor'} onValueChange={onAccidentSeverityChange}>
          <SelectTrigger id="accidentSeverity">
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
        <Label htmlFor="accidentDescription">Description</Label>
        <Textarea
          id="accidentDescription"
          value={accidentDescription || ''}
          onChange={(e) => onAccidentDescriptionChange(e.target.value)}
          placeholder="Describe the accident and repairs"
          rows={3}
        />
      </div>
    </div>
  );
}
