
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers, ModificationDetails } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const MODIFICATIONS = [
  {
    key: 'aftermarketWheels',
    label: 'Aftermarket Wheels',
    impact: '+$150',
    risk: false,
  },
  {
    key: 'suspensionLift',
    label: 'Suspension Lift Kit',
    impact: '–$250',
    risk: true,
  },
  {
    key: 'performanceTune',
    label: 'ECU/Performance Tune',
    impact: '–$500',
    risk: true,
  },
  {
    key: 'bodyKit',
    label: 'Body Kit (Visual Mod)',
    impact: '±$0',
    risk: false,
  },
  {
    key: 'exhaustUpgrade',
    label: 'Performance Exhaust',
    impact: '–$100',
    risk: true,
  },
  {
    key: 'headlightMod',
    label: 'Custom Headlights/Underglow',
    impact: '–$150',
    risk: true,
  },
  {
    key: 'audioSystem',
    label: 'Aftermarket Audio System',
    impact: '+$200',
    risk: false,
  },
  {
    key: 'turboOrSupercharger',
    label: 'Turbo/Supercharger Add-on',
    impact: '–$750',
    risk: true,
  },
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const modificationData: ModificationDetails = formData.modifications || {
    hasModifications: false,
    modified: false,
    types: []
  };

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

  const handleSpecificModToggle = (key: string) => {
    const currentMods = modificationData as any;
    const updated = {
      ...modificationData,
      [key]: !currentMods?.[key]
    };
    
    updateFormData({
      modifications: updated
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
            <div className="space-y-3 pl-6 border-l-2 border-gray-200">
              <div>
                <Label className="text-base font-medium mb-3 block">Types of Modifications</Label>
                <div className="space-y-3">
                  {MODIFICATIONS.map((mod) => {
                    const currentMods = modificationData as any;
                    const isSelected = currentMods?.[mod.key] ?? false;

                    return (
                      <div
                        key={mod.key}
                        onClick={() => handleSpecificModToggle(mod.key)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200
                          ${isSelected
                            ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-yellow-300 ring-1 ring-yellow-200'
                            : 'bg-white hover:bg-gray-50 border-gray-200'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleSpecificModToggle(mod.key)}
                              className="pointer-events-none h-4 w-4"
                            />
                            <span className="font-medium text-sm">{mod.label}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                mod.risk 
                                  ? 'border-red-200 text-red-600 bg-red-50' 
                                  : mod.impact.startsWith('+')
                                    ? 'border-green-200 text-green-700 bg-green-50'
                                    : 'border-gray-200 text-gray-600 bg-gray-50'
                              }`}
                            >
                              {mod.impact}
                            </Badge>
                            {mod.risk && (
                              <Badge variant="outline" className="border-red-300 text-red-500 text-xs bg-red-50">
                                High Risk
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Modifications can significantly affect vehicle value. 
                  High-risk modifications may reduce resale value and can be concerning to potential buyers.
                  Quality professional modifications may add value, while poor execution typically reduces it.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
