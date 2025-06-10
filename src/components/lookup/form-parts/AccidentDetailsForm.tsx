import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AccidentDetailsFormProps {
  accidentCount: number | undefined;
  accidentLocation: string | undefined;
  accidentSeverity: string | undefined;
  accidentDescription: string | undefined;
  onAccidentCountChange: (value: number | undefined) => void;
  onAccidentLocationChange: (value: string) => void;
  onAccidentSeverityChange: (value: string) => void;
  onAccidentDescriptionChange: (value: string) => void;
}

export function AccidentDetailsForm({
  accidentCount,
  accidentLocation,
  accidentSeverity,
  accidentDescription,
  onAccidentCountChange,
  onAccidentLocationChange,
  onAccidentSeverityChange,
  onAccidentDescriptionChange
}: AccidentDetailsFormProps) {

  const handleInputChange = (val: string) => {
    const parsedValue = val === '' ? undefined : parseInt(val, 10);
    onAccidentCountChange(isNaN(parsedValue) ? undefined : parsedValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="accident-count">Number of Accidents</Label>
        <Input
          type="number"
          id="accident-count"
          value={accidentCount === undefined ? '' : accidentCount.toString()}
          onChange={(e) => {
            const parsedValue = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
            onAccidentCountChange(isNaN(parsedValue) ? undefined : parsedValue);
          }}
          placeholder="Enter number of accidents"
        />
      </div>

      <div>
        <Label htmlFor="accident-location">Accident Location</Label>
        <Input
          type="text"
          id="accident-location"
          value={accidentLocation || ''}
          onChange={(e) => onAccidentLocationChange(e.target.value)}
          placeholder="Enter accident location"
        />
      </div>

      <div>
        <Label htmlFor="accident-severity">Accident Severity</Label>
        <Input
          type="text"
          id="accident-severity"
          value={accidentSeverity || ''}
          onChange={(e) => onAccidentSeverityChange(e.target.value)}
          placeholder="Enter accident severity"
        />
      </div>

      <div>
        <Label htmlFor="accident-description">Accident Description</Label>
        <Textarea
          id="accident-description"
          value={accidentDescription || ''}
          onChange={(e) => onAccidentDescriptionChange(e.target.value)}
          placeholder="Enter accident description"
        />
      </div>
    </div>
  );
}
