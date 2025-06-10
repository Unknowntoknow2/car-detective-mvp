
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface MakeModelSelectProps {
  make: string;
  model: string;
  onMakeChange: (value: string) => void;
  onModelChange: (value: string) => void;
}

export function MakeModelSelect({ make, model, onMakeChange, onModelChange }: MakeModelSelectProps) {
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW'];
  const models = ['Camry', 'Civic', 'F-150', 'Malibu', 'X3'];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="make">Make</Label>
        <Select value={make} onValueChange={onMakeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((makeItem) => (
              <SelectItem key={makeItem} value={makeItem}>
                {makeItem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="model">Model</Label>
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((modelItem) => (
              <SelectItem key={modelItem} value={modelItem}>
                {modelItem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
