
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Zap, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { FollowUpAnswers, MODIFICATION_TYPES, ModificationDetails } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const modificationData = formData.modifications || {
    hasModifications: false,
    modified: false,
    types: []
  };

  const hasModifications = modificationData.hasModifications || modificationData.modified;

  const handleModificationToggle = (checked: boolean) => {
    const updatedData = {
      ...modificationData,
      hasModifications: checked,
      modified: checked,
      ...(checked ? {} : {
        types: [],
        description: ''
      })
    };
    updateFormData({ modifications: updatedData });
  };

  const handleModificationTypeToggle = (type: string, checked: boolean) => {
    const currentTypes = modificationData.types || [];
    
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    const updatedData = {
      ...modificationData,
      types: updatedTypes
    };
    updateFormData({ modifications: updatedData });
  };

  const handleDescriptionChange = (description: string) => {
    const updatedData = {
      ...modificationData,
      description
    };
    updateFormData({ modifications: updatedData });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Modifications</h2>
          <p className="text-gray-600">Aftermarket changes and upgrades to your vehicle</p>
        </div>
      </div>

      {/* Primary Question */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-700">
            <Wrench className="h-5 w-5 mr-2" />
            Has this vehicle been modified?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Switch
              id="modifications-toggle"
              checked={hasModifications}
              onCheckedChange={handleModificationToggle}
            />
            <Label htmlFor="modifications-toggle" className="flex items-center cursor-pointer">
              {hasModifications ? (
                <>
                  <Zap className="h-4 w-4 mr-1 text-blue-500" />
                  Yes, this vehicle has modifications
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  No modifications
                </>
              )}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Modification Types */}
      {hasModifications && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Zap className="h-5 w-5 mr-2" />
              Types of Modifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MODIFICATION_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-3 p-3 rounded-lg border border-blue-200 bg-white">
                  <Checkbox
                    id={type}
                    checked={(modificationData.types || []).includes(type)}
                    onCheckedChange={(checked) => handleModificationTypeToggle(type, !!checked)}
                  />
                  <Label htmlFor={type} className="cursor-pointer font-medium">
                    {type}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modification-description">Modification Details</Label>
              <Textarea
                id="modification-description"
                value={modificationData.description || ''}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe the modifications made to your vehicle (brands, installation quality, etc.)"
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800">Impact on Vehicle Value</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Modifications can either increase or decrease vehicle value depending on:
                  </p>
                  <ul className="text-sm text-amber-700 mt-2 ml-4 list-disc">
                    <li>Quality of parts and installation</li>
                    <li>Reversibility of modifications</li>
                    <li>Market demand for specific modifications</li>
                    <li>Professional vs. DIY installation</li>
                  </ul>
                  <p className="text-sm text-amber-700 mt-2">
                    <strong>Generally:</strong> Performance modifications may decrease value, while comfort/convenience upgrades may increase value.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Modifications State */}
      {!hasModifications && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-green-800 mb-2">No Modifications</h3>
            <p className="text-green-600">
              Stock vehicles typically have more predictable resale values and broader market appeal.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
