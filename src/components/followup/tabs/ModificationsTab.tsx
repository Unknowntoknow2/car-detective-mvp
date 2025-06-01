
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Settings, AlertTriangle } from 'lucide-react';
import { FollowUpAnswers, ModificationDetails } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const modifications = formData.modifications || {
    hasModifications: false,
    modified: false,
    types: []
  };

  const updateModifications = (updates: Partial<ModificationDetails>) => {
    const newModifications = {
      ...modifications,
      ...updates
    };
    
    // Ensure modified field is always set to match hasModifications
    if ('hasModifications' in updates) {
      newModifications.modified = updates.hasModifications!;
    }
    
    updateFormData({ modifications: newModifications });
  };

  const modificationTypes = [
    'Performance Engine Tuning',
    'Cold Air Intake',
    'Exhaust System',
    'Suspension/Lowering',
    'Wheels & Tires (Non-OEM)',
    'Body Kit/Spoilers',
    'Custom Paint Job',
    'Audio System Upgrade',
    'Lighting Modifications',
    'Interior Modifications',
    'Turbo/Supercharger',
    'Nitrous System'
  ];

  const handleModificationTypeToggle = (type: string) => {
    const currentTypes = modifications.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    updateModifications({ 
      types: newTypes,
      hasModifications: newTypes.length > 0,
      modified: newTypes.length > 0
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-500" />
            Vehicle Modifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Has Modifications */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Has this vehicle been modified from factory specifications?</Label>
            <RadioGroup
              value={modifications.hasModifications ? 'yes' : 'no'}
              onValueChange={(value) => updateModifications({ 
                hasModifications: value === 'yes',
                modified: value === 'yes'
              })}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="no" id="no-modifications" />
                <Label htmlFor="no-modifications" className="cursor-pointer flex-1">
                  <div className="font-medium">Stock/Original</div>
                  <div className="text-sm text-gray-500">No modifications made</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="yes" id="yes-modifications" />
                <Label htmlFor="yes-modifications" className="cursor-pointer flex-1">
                  <div className="font-medium">Modified</div>
                  <div className="text-sm text-gray-500">Has modifications</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Modification Types */}
          {modifications.hasModifications && (
            <div className="space-y-4 border-t pt-6">
              <Label className="text-base font-medium">Types of Modifications</Label>
              <p className="text-sm text-gray-600">
                Select all modifications that have been made to the vehicle.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modificationTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={type}
                      checked={modifications.types?.includes(type) || false}
                      onCheckedChange={() => handleModificationTypeToggle(type)}
                    />
                    <Label htmlFor={type} className="cursor-pointer flex-1 font-medium">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Value Impact Warning */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Modification Value Impact</h4>
                    <div className="text-sm text-orange-800 mt-2 space-y-1">
                      <p>• Most modifications do not add to resale value</p>
                      <p>• Performance modifications may actually decrease value</p>
                      <p>• Quality of installation matters significantly</p>
                      <p>• Keep original parts when possible</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Modifications Summary */}
              {modifications.types && modifications.types.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Selected Modifications ({modifications.types.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {modifications.types.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
