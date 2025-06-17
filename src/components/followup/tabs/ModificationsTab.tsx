
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers, ModificationDetails } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const modificationTypes = [
  'Lift Kit',
  'Performance Tune',
  'Custom Paint Job',
  'Tinted Windows',
  'Upgraded Sound System',
  'Custom Wheels',
  'Other'
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  // Convert string to object if needed, or use default
  const getModificationData = (): ModificationDetails => {
    if (typeof formData.modifications === 'object' && formData.modifications !== null) {
      return formData.modifications;
    }
    return {
      hasModifications: false,
      types: []
    };
  };

  const modData = getModificationData();

  const handleModificationChange = (checked: boolean, modType: string) => {
    const currentMods = modData.types || [];
    let updatedMods;

    if (checked) {
      updatedMods = [...currentMods, modType];
    } else {
      updatedMods = currentMods.filter((mod: string) => mod !== modType);
    }

    const updatedData: ModificationDetails = {
      ...modData,
      hasModifications: true,
      types: updatedMods
    };

    updateFormData({ modifications: updatedData });
  };

  const handleAdditionalNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedData: ModificationDetails = {
      ...modData,
      hasModifications: modData.hasModifications || false,
      types: modData.types || [],
      additionalNotes: e.target.value
    };
    updateFormData({ modifications: updatedData });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Has the vehicle been modified from its original factory condition?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modificationTypes.map((modType) => (
          <div key={modType} className="flex items-center space-x-2">
            <Checkbox
              id={modType}
              checked={modData.types?.includes(modType) || false}
              onCheckedChange={(checked: boolean) => handleModificationChange(checked, modType)}
            />
            <Label htmlFor={modType} className="cursor-pointer">
              {modType}
            </Label>
          </div>
        ))}
      </div>
      <div>
        <Label htmlFor="modification_notes">Additional Notes</Label>
        <Textarea
          id="modification_notes"
          placeholder="Please provide details about the modifications."
          value={modData.additionalNotes || ''}
          onChange={handleAdditionalNotesChange}
        />
      </div>
    </div>
  );
}
