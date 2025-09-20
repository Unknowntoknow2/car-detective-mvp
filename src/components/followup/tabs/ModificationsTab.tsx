
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const modificationTypes = [
  { value: 'performance', label: 'Performance Modifications', desc: 'Engine, exhaust, suspension tuning' },
  { value: 'appearance', label: 'Appearance Modifications', desc: 'Body kits, paint, wheels, tinting' },
  { value: 'suspension', label: 'Suspension Modifications', desc: 'Lowering, lifting, coilovers' },
  { value: 'wheels', label: 'Wheels & Tires', desc: 'Aftermarket wheels, performance tires' },
  { value: 'interior', label: 'Interior Modifications', desc: 'Seats, stereo, dashboard changes' },
  { value: 'lighting', label: 'Lighting Modifications', desc: 'LED, HID, custom lighting' },
  { value: 'exhaust', label: 'Exhaust System', desc: 'Aftermarket exhaust, headers' },
  { value: 'other', label: 'Other Modifications', desc: 'Any other aftermarket changes' }
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const modifications = formData.modifications || {
    hasModifications: false,
    modified: false,
    types: [],
    reversible: false,
    description: '',
    additionalNotes: ''
  };

  const handleModificationChange = (field: string, value: any) => {
    updateFormData({
      modifications: {
        ...modifications,
        [field]: value
      }
    });
  };

  const handleHasModificationsChange = (hasModifications: boolean) => {
    updateFormData({
      modifications: {
        ...modifications,
        hasModifications,
        modified: hasModifications,
        types: hasModifications ? modifications.types : []
      }
    });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = modifications.types || [];
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    handleModificationChange('types', updatedTypes);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Vehicle Modifications
          </CardTitle>
          <p className="text-sm text-gray-600">
            Information about any aftermarket modifications or customizations
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Has Modifications */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Has this vehicle been modified?</Label>
              <p className="text-sm text-gray-600 mb-3">
                Include any aftermarket parts, performance modifications, or customizations
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                  modifications.hasModifications === false
                    ? 'bg-green-50 border-green-200 ring-2 ring-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleHasModificationsChange(false)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={modifications.hasModifications === false}
                    onCheckedChange={() => handleHasModificationsChange(false)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <Label className="cursor-pointer font-medium text-green-700">
                      Stock/Unmodified
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      No aftermarket modifications
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                  modifications.hasModifications === true
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleHasModificationsChange(true)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={modifications.hasModifications === true}
                    onCheckedChange={() => handleHasModificationsChange(true)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <Label className="cursor-pointer font-medium text-blue-700">
                      Yes, has modifications
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Aftermarket parts installed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modification Types - Only show if has modifications */}
          {modifications.hasModifications && (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Types of Modifications</Label>
                  <p className="text-sm text-gray-600">Select all types of modifications present</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modificationTypes.map((type) => {
                    const isChecked = modifications.types?.includes(type.value) || false;
                    
                    return (
                      <div
                        key={type.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          isChecked
                            ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTypeChange(type.value, !isChecked)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => handleTypeChange(type.value, checked === true)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <Label className="cursor-pointer font-medium text-blue-700">
                              {type.label}
                            </Label>
                            <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reversible */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Are modifications reversible?</Label>
                  <p className="text-sm text-gray-600">Can the vehicle be returned to stock condition?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                      modifications.reversible === true
                        ? 'bg-green-50 border-green-200 ring-2 ring-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleModificationChange('reversible', true)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={modifications.reversible === true}
                        onCheckedChange={() => handleModificationChange('reversible', true)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <Label className="cursor-pointer font-medium text-green-700">
                          Reversible
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Can return to stock condition
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                      modifications.reversible === false
                        ? 'bg-red-50 border-red-200 ring-2 ring-red-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleModificationChange('reversible', false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={modifications.reversible === false}
                        onCheckedChange={() => handleModificationChange('reversible', false)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <Label className="cursor-pointer font-medium text-red-700">
                          Permanent
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Cannot be easily reversed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modification Description */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="modification-description" className="text-base font-medium">
                    Modification Details
                  </Label>
                  <p className="text-sm text-gray-600">
                    Describe the specific modifications, brands, and quality of work
                  </p>
                </div>
                
                <Textarea
                  id="modification-description"
                  value={modifications.description || ''}
                  onChange={(e) => handleModificationChange('description', e.target.value)}
                  placeholder="Describe the modifications in detail..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          {/* Modifications Summary */}
          <Card className={`${modifications.hasModifications ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`}>
            <CardHeader>
              <CardTitle className={`${modifications.hasModifications ? 'text-blue-800' : 'text-green-800'} flex items-center gap-2`}>
                {modifications.hasModifications ? (
                  <Settings className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Modification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {modifications.hasModifications ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-700 mb-1">Types</div>
                      <Badge variant="secondary" className="text-xs">
                        {modifications.types?.length || 0} Selected
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-700 mb-1">Reversible</div>
                      <Badge variant={modifications.reversible ? 'default' : 'destructive'} className="text-xs">
                        {modifications.reversible ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Impact:</strong> Modifications can affect value positively or negatively depending on quality, type, and market appeal.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Stock Vehicle:</strong> Unmodified vehicles typically have broader market appeal and stable resale values.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
