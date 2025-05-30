
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Car, AlertTriangle, CheckCircle } from 'lucide-react';
import { FollowUpAnswers, TIRE_CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface PhysicalFeaturesTabProps {
  formData: FollowUpAnswers;
  onTireConditionChange: (condition: string) => void;
  onFrameDamageChange: (hasDamage: boolean) => void;
}

export function PhysicalFeaturesTab({ 
  formData, 
  onTireConditionChange, 
  onFrameDamageChange 
}: PhysicalFeaturesTabProps) {
  const tireCondition = formData.tire_condition || 'good';
  const hasFrameDamage = formData.frame_damage || false;

  const selectedTireOption = TIRE_CONDITION_OPTIONS.find(option => option.value === tireCondition);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Physical Condition</h2>
          <p className="text-gray-600">Assess the physical condition of your vehicle</p>
        </div>
      </div>

      {/* Tire Condition */}
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-700">
            <Car className="h-5 w-5 mr-2" />
            Tire Condition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={tireCondition}
            onValueChange={onTireConditionChange}
            className="space-y-3"
          >
            {TIRE_CONDITION_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="cursor-pointer font-medium">
                    {option.label}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  {option.impact !== 0 && (
                    <Badge 
                      variant={option.impact > 0 ? "default" : "destructive"} 
                      className="mt-1 text-xs"
                    >
                      {option.impact > 0 ? '+' : ''}${option.impact}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Frame Damage */}
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Frame Condition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={hasFrameDamage ? 'yes' : 'no'}
            onValueChange={(value) => onFrameDamageChange(value === 'yes')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-frame-damage" />
              <Label htmlFor="no-frame-damage" className="flex items-center cursor-pointer">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                No frame damage
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-frame-damage" />
              <Label htmlFor="yes-frame-damage" className="flex items-center cursor-pointer">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                Has frame damage
              </Label>
            </div>
          </RadioGroup>
          
          {hasFrameDamage && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Frame Damage Impact</h4>
                  <p className="text-sm text-red-600 mt-1">
                    Frame damage significantly affects vehicle value and safety. This will be factored 
                    into the valuation calculation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      {selectedTireOption && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Physical Condition Summary</h4>
                <div className="text-sm text-blue-600 mt-1 space-y-1">
                  <p>Tire Condition: {selectedTireOption.label}</p>
                  <p>Frame Status: {hasFrameDamage ? 'Damage Present' : 'No Damage'}</p>
                  {selectedTireOption.impact !== 0 && (
                    <p>Estimated Impact: {selectedTireOption.impact > 0 ? '+' : ''}${selectedTireOption.impact}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
