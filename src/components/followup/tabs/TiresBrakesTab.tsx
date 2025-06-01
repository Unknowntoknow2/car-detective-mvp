
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Wrench, AlertTriangle } from 'lucide-react';
import { FollowUpAnswers, TIRE_CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface TiresBrakesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function TiresBrakesTab({ formData, updateFormData }: TiresBrakesTabProps) {
  const tireCondition = formData.tire_condition || 'good';
  const brakeCondition = formData.brake_condition || 'good';

  const conditionOptions = [
    { 
      value: 'excellent' as const, 
      label: 'Like New', 
      description: 'Recently replaced or minimal wear',
      color: 'bg-green-100 border-green-500 text-green-800',
      impact: '+$200'
    },
    { 
      value: 'good' as const, 
      label: 'Good Condition', 
      description: 'Normal wear, good tread remaining',
      color: 'bg-blue-100 border-blue-500 text-blue-800',
      impact: 'No impact'
    },
    { 
      value: 'fair' as const, 
      label: 'Some Wear', 
      description: 'Noticeable wear, may need replacement soon',
      color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
      impact: '-$300'
    },
    { 
      value: 'poor' as const, 
      label: 'Need Replacement', 
      description: 'Worn out, unsafe, or damaged',
      color: 'bg-red-100 border-red-500 text-red-800',
      impact: '-$600'
    }
  ];

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'fair': return '🟡';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tire Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-blue-500" />
            Tire Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Select the current condition of your tires. This affects vehicle safety and value.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conditionOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => updateFormData({ tire_condition: option.value })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  tireCondition === option.value
                    ? option.color
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getConditionIcon(option.value)}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">{option.impact}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tire Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Tire Assessment Tips</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Check tread depth - new tires have 10/32" to 12/32" tread</li>
              <li>• Look for uneven wear patterns</li>
              <li>• Check for cracks, bulges, or damage</li>
              <li>• Consider age - tires over 6 years may need replacement</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Brake Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Brake Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Assess your brake system condition. This is critical for safety and vehicle value.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conditionOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => updateFormData({ brake_condition: option.value })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  brakeCondition === option.value
                    ? option.color
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getConditionIcon(option.value)}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">{option.impact}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Brake Assessment Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Brake System Signs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-red-800 mb-1">Good Brakes:</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Smooth, quiet operation</li>
                  <li>• Firm pedal feel</li>
                  <li>• No grinding or squealing</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-red-800 mb-1">Warning Signs:</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Squealing or grinding noise</li>
                  <li>• Soft or spongy pedal</li>
                  <li>• Vibration when braking</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Current Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Tires:</span>
                <span className="ml-2 text-blue-700">
                  {getConditionIcon(tireCondition)} {conditionOptions.find(opt => opt.value === tireCondition)?.label}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Brakes:</span>
                <span className="ml-2 text-blue-700">
                  {getConditionIcon(brakeCondition)} {conditionOptions.find(opt => opt.value === brakeCondition)?.label}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
