
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ServiceDetailsFormProps {
  serviceDate: string;
  setServiceDate: (date: string) => void;
  mileage: number | null;
  setMileage: (mileage: number | null) => void;
  description: string;
  setDescription: (description: string) => void;
  isDisabled: boolean;
}

export function ServiceDetailsForm({
  serviceDate,
  setServiceDate,
  mileage,
  setMileage,
  description,
  setDescription,
  isDisabled
}: ServiceDetailsFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="serviceDate">Service Date</Label>
        <Input
          id="serviceDate"
          type="date"
          value={serviceDate}
          onChange={(e) => setServiceDate(e.target.value)}
          disabled={isDisabled}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mileage">Mileage</Label>
        <Input
          id="mileage"
          type="number"
          placeholder="Enter vehicle mileage"
          value={mileage || ''}
          onChange={(e) => setMileage(e.target.value ? parseInt(e.target.value) : null)}
          disabled={isDisabled}
          min={0}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Service Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the service performed"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isDisabled}
          rows={3}
        />
      </div>
    </>
  );
}
