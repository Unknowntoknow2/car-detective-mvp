
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ServiceHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onServiceHistoryChange: (updates: Partial<FollowUpAnswers>) => void;
}

const serviceOptions = [
  { value: 'oil_change', label: 'Oil Changes' },
  { value: 'tire_rotation', label: 'Tire Rotations' },
  { value: 'brake_service', label: 'Brake Services' },
  { value: 'transmission_service', label: 'Transmission Services' },
  { value: 'engine_tune_up', label: 'Engine Tune-Ups' },
  { value: 'regular_inspection', label: 'Regular Inspections' },
];

export function ServiceHistoryTab({ formData, updateFormData, onServiceHistoryChange }: ServiceHistoryTabProps) {

const handleMaintenanceChange = (checked: boolean, serviceType: string) => {
  const currentServices = formData.serviceHistory?.services || [];
  let updatedServices;

  if (checked) {
    updatedServices = [...currentServices, serviceType];
  } else {
    updatedServices = currentServices.filter((service: string) => service !== serviceType);
  }

  updateFormData({
    serviceHistory: {
      ...formData.serviceHistory,
      hasRecords: true,
      services: updatedServices
    }
  });
};

const handleServiceChange = (checked: boolean, serviceType: string) => {
  handleMaintenanceChange(checked, serviceType);
};

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Has the vehicle received regular maintenance?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceOptions.map((service) => (
          <div key={service.value} className="flex items-center space-x-2">
            <Checkbox
              id={service.value}
              checked={formData.serviceHistory?.services?.includes(service.value) || false}
              onCheckedChange={(checked: boolean) => handleServiceChange(checked, service.value)}
            />
            <Label htmlFor={service.value} className="cursor-pointer">
              {service.label}
            </Label>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="additional_notes">Additional Notes</Label>
        <Textarea
          id="additional_notes"
          placeholder="Any notes about the vehicle's service history?"
          value={formData.additional_notes || ''}
          onChange={(e) => updateFormData({ additional_notes: e.target.value })}
        />
      </div>
    </div>
  );
}
