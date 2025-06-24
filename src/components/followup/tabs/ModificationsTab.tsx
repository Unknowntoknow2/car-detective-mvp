
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers, ModificationDetails } from '@/types/follow-up-answers';
import { Wrench, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const modificationCategories = {
  'Performance': [
    'Cold air intake',
    'Exhaust system upgrade',
    'Turbo/Supercharger',
    'Engine tune/ECU remap',
    'Suspension modifications',
    'Brake upgrades',
    'Transmission modifications'
  ],
  'Exterior': [
    'Custom paint/wrap',
    'Body kit',
    'Spoiler/Wing',
    'Custom wheels/Rims',
    'Lowered/Raised suspension',
    'Tinted windows',
    'Custom lighting'
  ],
  'Interior': [
    'Custom upholstery',
    'Aftermarket stereo/Audio',
    'Racing seats',
    'Custom dashboard',
    'Steering wheel upgrade',
    'Interior lighting',
    'Gauge cluster modifications'
  ],
  'Safety/Security': [
    'Alarm system upgrade',
    'GPS tracking',
    'Dash camera',
    'Roll cage',
    'Racing harnesses',
    'Fire suppression system'
  ]
};

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const modifications = formData.modifications || {
    hasModifications: false,
    modified: false,
    types: [],
    additionalNotes: ''
  };

  const updateModifications = (updates: Partial<ModificationDetails>) => {
    updateFormData({
      modifications: { ...modifications, ...updates }
    });
  };

  const handleModificationStatusChange = (hasModifications: string) => {
    const hasModified = hasModifications === 'yes';
    updateModifications({
      hasModifications: hasModified,
      modified: hasModified,
      types: hasModified ? modifications.types : [],
      additionalNotes: hasModified ? modifications.additionalNotes : ''
    });
  };

  const handleModificationTypeChange = (type: string, checked: boolean) => {
    const currentTypes = modifications.types || [];
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    updateModifications({ types: updatedTypes });
  };

  const getModificationImpact = () => {
    const modCount = modifications.types?.length || 0;
    if (modCount === 0) return null;
    
    if (modCount <= 2) {
      return { 
        level: 'Low Impact', 
        color: 'bg-green-500', 
        icon: CheckCircle,
        description: 'Minor modifications, minimal value impact' 
      };
    } else if (modCount <= 5) {
      return { 
        level: 'Moderate Impact', 
        color: 'bg-yellow-500', 
        icon: AlertTriangle,
        description: 'Several modifications, may affect resale value' 
      };
    } else {
      return { 
        level: 'High Impact', 
        color: 'bg-red-500', 
        icon: X,
        description: 'Extensive modifications, significant value considerations' 
      };
    }
  };

  const impact = getModificationImpact();

  return (
    <div className="space-y-6">
      {/* Modification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-500" />
            Vehicle Modifications
          </CardTitle>
          <p className="text-sm text-gray-600">
            Has this vehicle been modified from its original factory condition?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={modifications.hasModifications ? 'yes' : 'no'}
            onValueChange={handleModificationStatusChange}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-modifications" />
              <Label htmlFor="no-modifications" className="font-medium">No modifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-modifications" />
              <Label htmlFor="has-modifications" className="font-medium">Yes, has modifications</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Modification Details */}
      {modifications.hasModifications && (
        <>
          {/* Modification Types */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Modifications</CardTitle>
              <p className="text-sm text-gray-600">
                Select all modifications that have been made to this vehicle
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(modificationCategories).map(([category, types]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {types.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mod-${type}`}
                            checked={modifications.types?.includes(type) || false}
                            onCheckedChange={(checked) => 
                              handleModificationTypeChange(type, checked as boolean)
                            }
                          />
                          <Label htmlFor={`mod-${type}`} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Modifications Summary */}
          {modifications.types && modifications.types.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Selected Modifications</span>
                  {impact && (
                    <div className="flex items-center gap-2">
                      <impact.icon className="w-4 h-4" />
                      <Badge className={`${impact.color} text-white`}>
                        {impact.level}
                      </Badge>
                    </div>
                  )}
                </CardTitle>
                {impact && (
                  <p className="text-sm text-gray-600">{impact.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {modifications.types.map((type) => (
                    <Badge key={type} variant="secondary" className="text-sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Modification Details</CardTitle>
              <p className="text-sm text-gray-600">
                Provide additional information about the modifications
              </p>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="modification-notes">Additional Notes</Label>
                <Textarea
                  id="modification-notes"
                  placeholder="Include details such as: brand names, installation quality, professional vs DIY, costs, performance gains, warranty status, reversibility, etc."
                  value={modifications.additionalNotes || ''}
                  onChange={(e) => updateModifications({ additionalNotes: e.target.value })}
                  rows={4}
                  className="w-full mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Modification Impact Warning */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Modification Impact Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-orange-700">
                <p>
                  <strong>Important:</strong> Vehicle modifications can significantly impact valuation:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Performance modifications may reduce resale appeal</li>
                  <li>Quality of installation affects value impact</li>
                  <li>Original parts retention is important</li>
                  <li>Professional installation vs DIY affects valuation</li>
                  <li>Some modifications may void warranties</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Modifications Info */}
      {!modifications.hasModifications && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Factory Original Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">
              Vehicles in original factory condition typically maintain better resale value and appeal to a wider range of buyers.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
