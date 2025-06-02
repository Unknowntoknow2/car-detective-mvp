
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers, ModificationDetails } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const modificationData: ModificationDetails = formData.modifications || {
    hasModifications: false,
    modified: false,
    types: []
  };

  const modificationTypes = [
    'Engine Performance',
    'Exhaust System',
    'Suspension',
    'Wheels & Tires',
    'Body Kit',
    'Paint/Wrap',
    'Interior',
    'Audio System',
    'Lighting',
    'Other'
  ];

  const handleModificationToggle = (checked: boolean) => {
    updateFormData({
      modifications: {
        ...modificationData,
        hasModifications: checked,
        modified: checked,
        types: checked ? modificationData.types : []
      }
    });
  };

  const handleModificationTypeToggle = (type: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...modificationData.types, type]
      : modificationData.types.filter(t => t !== type);
    
    updateFormData({
      modifications: {
        ...modificationData,
        types: updatedTypes
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">⚙️</span>
            Vehicle Modifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="has-modifications"
              checked={modificationData.hasModifications}
              onCheckedChange={handleModificationToggle}
            />
            <Label htmlFor="has-modifications">
              Has this vehicle been modified from factory specifications?
            </Label>
          </div>

          {modificationData.hasModifications && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <div>
                <Label className="text-base font-medium">Types of Modifications</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {modificationTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox
                        id={type}
                        checked={modificationData.types.includes(type)}
                        onCheckedChange={(checked) => handleModificationTypeToggle(type, !!checked)}
                      />
                      <Label htmlFor={type} className="cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {modificationData.types.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Modifications can affect vehicle value both positively and negatively. 
                    Professional modifications may add value, while poor quality modifications typically reduce value.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
