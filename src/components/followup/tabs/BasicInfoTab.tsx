
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, Car, MapPin, User } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  onUpdate: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, onUpdate }: BasicInfoTabProps) {
  const handleConditionChange = (field: 'condition' | 'exterior_condition' | 'interior_condition', value: string) => {
    onUpdate({ [field]: value });
  };

  const ConditionSelector = ({ 
    title, 
    field, 
    icon: Icon 
  }: { 
    title: string; 
    field: 'condition' | 'exterior_condition' | 'interior_condition';
    icon: any;
  }) => (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-blue-700 text-xl">
          <Icon className="h-6 w-6 mr-3" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={formData[field] || ''}
          onValueChange={(value) => handleConditionChange(field, value)}
          className="space-y-4"
        >
          {CONDITION_OPTIONS.map((option) => (
            <div key={option.value} className="relative">
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <RadioGroupItem value={option.value} id={`${field}-${option.value}`} className="h-5 w-5" />
                <Label htmlFor={`${field}-${option.value}`} className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-semibold text-lg text-gray-900">{option.label}</span>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className={`font-medium text-sm px-3 py-1 rounded-full ${
                        option.value === 'excellent' ? 'bg-green-100 text-green-700' :
                        option.value === 'good' ? 'bg-blue-100 text-blue-700' :
                        option.value === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {option.impact}
                      </span>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Info className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Basic Vehicle Information</h2>
          <p className="text-gray-600 text-lg">Essential details about your vehicle's condition and usage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mileage and ZIP Code */}
        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-blue-700 text-xl">
                <Car className="h-6 w-6 mr-3" />
                Vehicle Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="mileage" className="text-base font-semibold text-gray-700 mb-3 block">
                  Current Mileage
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage || ''}
                  onChange={(e) => onUpdate({ mileage: parseInt(e.target.value) || undefined })}
                  placeholder="Enter current mileage"
                  className="h-12 text-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500"
                />
                <p className="text-sm text-blue-600 mt-2 font-medium">Lower mileage typically increases value</p>
              </div>

              <div>
                <Label htmlFor="zip_code" className="text-base font-semibold text-gray-700 mb-3 block">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  ZIP Code
                </Label>
                <Input
                  id="zip_code"
                  type="text"
                  value={formData.zip_code || ''}
                  onChange={(e) => onUpdate({ zip_code: e.target.value })}
                  placeholder="Enter ZIP code"
                  maxLength={5}
                  className="h-12 text-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500"
                />
                <p className="text-sm text-blue-600 mt-2 font-medium">Location affects regional market values</p>
              </div>

              <div>
                <Label htmlFor="previous_owners" className="text-base font-semibold text-gray-700 mb-3 block">
                  <User className="h-4 w-4 inline mr-2" />
                  Number of Previous Owners
                </Label>
                <Input
                  id="previous_owners"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.previous_owners || ''}
                  onChange={(e) => onUpdate({ previous_owners: parseInt(e.target.value) || undefined })}
                  placeholder="Enter number of owners"
                  className="h-12 text-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500"
                />
                <p className="text-sm text-blue-600 mt-2 font-medium">Fewer owners typically means higher value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Vehicle Condition */}
        <ConditionSelector 
          title="Overall Vehicle Condition" 
          field="condition" 
          icon={Car}
        />
      </div>

      {/* Exterior and Interior Condition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConditionSelector 
          title="Exterior Condition" 
          field="exterior_condition" 
          icon={Car}
        />
        
        <ConditionSelector 
          title="Interior Condition" 
          field="interior_condition" 
          icon={Car}
        />
      </div>
    </div>
  );
}
