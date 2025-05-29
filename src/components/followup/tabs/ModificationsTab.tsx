
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { FollowUpAnswers, MODIFICATION_TYPES } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  onModificationsChange: (modified: boolean, types?: string[]) => void;
}

export function ModificationsTab({ formData, onModificationsChange }: ModificationsTabProps) {
  const hasModifications = formData.modifications?.modified;

  const handleModificationTypeToggle = (type: string, checked: boolean) => {
    const currentTypes = formData.modifications?.types || [];
    
    if (checked) {
      onModificationsChange(true, [...currentTypes, type]);
    } else {
      onModificationsChange(true, currentTypes.filter(t => t !== type));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Modifications</h2>
          <p className="text-gray-600">Aftermarket changes and upgrades</p>
        </div>
      </div>

      {/* Primary Question */}
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-700">
            <Settings className="h-5 w-5 mr-2" />
            Has this vehicle been modified?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={hasModifications ? 'yes' : 'no'}
            onValueChange={(value) => onModificationsChange(value === 'yes')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-modifications" />
              <Label htmlFor="no-modifications" className="flex items-center cursor-pointer">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                No modifications
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-modifications" />
              <Label htmlFor="yes-modifications" className="flex items-center cursor-pointer">
                <Zap className="h-4 w-4 mr-1 text-blue-500" />
                Yes, there are modifications
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Modification Types */}
      {hasModifications && (
        <Card className="border-gray-200 bg-gray-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-700">
              <Zap className="h-5 w-5 mr-2" />
              Types of Modifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MODIFICATION_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-3">
                  <Checkbox
                    id={type}
                    checked={(formData.modifications?.types || []).includes(type)}
                    onCheckedChange={(checked) => handleModificationTypeToggle(type, !!checked)}
                  />
                  <Label htmlFor={type} className="cursor-pointer font-medium">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Impact on Value</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Modifications can either increase or decrease vehicle value depending on quality, 
                    reversibility, and market demand. Professional installations typically retain more value.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
