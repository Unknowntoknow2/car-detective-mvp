
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ServiceDetailsFormProps {
  serviceDate: string;
  mileage: string;
  description: string;
  onServiceDateChange: (value: string) => void;
  onMileageChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function ServiceDetailsForm({ 
  serviceDate, 
  mileage, 
  description,
  onServiceDateChange,
  onMileageChange,
  onDescriptionChange
}: ServiceDetailsFormProps) {
  return (
    <div className="grid gap-4 mb-4">
      <div>
        <Label htmlFor="service-date">Service Date</Label>
        <Input 
          id="service-date" 
          type="date" 
          value={serviceDate}
          onChange={(e) => onServiceDateChange(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="mileage">Mileage at Service</Label>
        <Input 
          id="mileage" 
          type="number" 
          placeholder="e.g. 45000"
          value={mileage}
          onChange={(e) => onMileageChange(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Service Description</Label>
        <Input 
          id="description" 
          placeholder="e.g. Oil change, brake service"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </div>
  );
}
