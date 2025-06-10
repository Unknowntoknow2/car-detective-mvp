import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface ModificationsTabProps {
  formData: any;
  updateFormData: (updates: Partial<any>) => void;
}

const modificationOptions = [
  { label: 'Lift Kit', value: 'lift_kit' },
  { label: 'Oversized Tires', value: 'oversized_tires' },
  { label: 'Performance Exhaust', value: 'performance_exhaust' },
  { label: 'Engine Tuning', value: 'engine_tuning' },
  { label: 'Aftermarket Audio', value: 'aftermarket_audio' },
  { label: 'Tinted Windows', value: 'tinted_windows' },
  { label: 'Custom Paint', value: 'custom_paint' },
  { label: 'Other', value: 'other' },
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const handleModificationChange = (checked: boolean, modType: string) => {
    const currentMods = formData.modifications || [];
    let updatedMods;

    if (checked) {
      updatedMods = [...currentMods, modType];
    } else {
      updatedMods = currentMods.filter((mod: string) => mod !== modType);
    }

    updateFormData({ modifications: updatedMods });
  };

  const handleAdditionalNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ additional_notes: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Modifications</h3>
        <p className="text-sm text-muted-foreground">
          Select any modifications that have been made to the vehicle.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modificationOptions.map((mod) => (
            <div key={mod.value} className="flex items-center space-x-2">
              <Checkbox
                id={`mod-${mod.value}`}
                checked={formData.modifications?.includes(mod.value)}
                onCheckedChange={(checked) => handleModificationChange(checked, mod.value)}
              />
              <label
                htmlFor={`mod-${mod.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {mod.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="additional-notes" className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <div className="mt-1">
          <Textarea
            id="additional-notes"
            rows={3}
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
            value={formData.additional_notes || ''}
            onChange={handleAdditionalNotesChange}
            placeholder="Any other relevant information about the vehicle's condition or history?"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Provide any additional details about the vehicle's modifications or condition.
        </p>
      </div>
    </div>
  );
}
