
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, AlertTriangle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const MODIFICATION_TYPES = [
  { id: 'engine', label: 'Engine/Performance Modifications', impact: 'high' },
  { id: 'exhaust', label: 'Exhaust System', impact: 'medium' },
  { id: 'suspension', label: 'Suspension/Lowering', impact: 'medium' },
  { id: 'wheels', label: 'Aftermarket Wheels/Tires', impact: 'low' },
  { id: 'body', label: 'Body Kit/Spoilers', impact: 'medium' },
  { id: 'interior', label: 'Interior Modifications', impact: 'low' },
  { id: 'audio', label: 'Audio/Electronics', impact: 'low' },
  { id: 'lighting', label: 'Lighting Modifications', impact: 'low' },
  { id: 'paint', label: 'Custom Paint/Wrap', impact: 'medium' },
  { id: 'turbo', label: 'Turbo/Supercharger', impact: 'high' }
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const modifications = formData.modifications || { hasModifications: false, modified: false, types: [] };

  const handleModificationToggle = (hasModifications: boolean) => {
    updateFormData({
      modifications: {
        ...modifications,
        hasModifications,
        modified: hasModifications,
        types: hasModifications ? modifications.types : []
      }
    });
  };

  const handleTypeToggle = (typeId: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...modifications.types, typeId]
      : modifications.types.filter(t => t !== typeId);
    
    updateFormData({
      modifications: {
        ...modifications,
        types: updatedTypes
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="flex items-center text-purple-800">
            <Wrench className="h-5 w-5 mr-2" />
            Vehicle Modifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Has this vehicle been modified?</Label>
              <RadioGroup
                value={modifications.hasModifications ? 'yes' : 'no'}
                onValueChange={(value) => handleModificationToggle(value === 'yes')}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-mods" />
                  <Label htmlFor="no-mods">No modifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-mods" />
                  <Label htmlFor="has-mods">Yes, vehicle has modifications</Label>
                </div>
              </RadioGroup>
            </div>

            {modifications.hasModifications && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Select all modifications that apply:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {MODIFICATION_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <Checkbox
                        id={type.id}
                        checked={modifications.types.includes(type.id)}
                        onCheckedChange={(checked) => handleTypeToggle(type.id, !!checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={type.id} className="cursor-pointer font-medium">
                          {type.label}
                        </Label>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            type.impact === 'high' ? 'bg-red-100 text-red-700' :
                            type.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {type.impact} impact
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {modifications.types.length > 0 && (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-800">Value Impact Notice</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Modifications can significantly affect vehicle value. Performance modifications 
                          typically reduce value, while cosmetic changes have minimal impact. Professional 
                          installations may help preserve value better than DIY modifications.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
