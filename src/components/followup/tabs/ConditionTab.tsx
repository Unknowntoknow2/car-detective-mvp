
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const conditionCategories = [
  {
    key: 'tire_condition' as keyof FollowUpAnswers,
    title: 'Tire Condition',
    subtitle: 'Condition Rating',
    options: [
      {
        value: 'excellent',
        label: 'Excellent',
        description: 'Like new condition',
        details: 'Tread: 8-10/32", No visible wear'
      },
      {
        value: 'good',
        label: 'Good', 
        description: 'Normal wear and tear',
        details: 'Tread: 4-6/32", Adequate tread, some wear visible'
      },
      {
        value: 'fair',
        label: 'Fair',
        description: 'Noticeable wear',
        details: 'Tread: 2-4/32", Significant wear, consider replacement soon'
      },
      {
        value: 'poor',
        label: 'Poor',
        description: 'Needs replacement',
        details: 'Tread: <2/32", Unsafe, immediate replacement needed'
      }
    ]
  },
  {
    key: 'exterior_condition' as keyof FollowUpAnswers,
    title: 'Exterior Condition',
    subtitle: 'Condition Rating',
    options: [
      {
        value: 'excellent',
        label: 'Excellent',
        description: 'Perfect condition',
        details: 'No scratches, dents, or paint issues'
      },
      {
        value: 'good',
        label: 'Good',
        description: 'Normal wear and tear',
        details: 'Minor scratches, good paint condition'
      },
      {
        value: 'fair',
        label: 'Fair',
        description: 'Visible wear',
        details: 'Multiple scratches, some dents, paint fading'
      },
      {
        value: 'poor',
        label: 'Poor',
        description: 'Significant damage',
        details: 'Major dents, rust, paint damage'
      }
    ]
  },
  {
    key: 'interior_condition' as keyof FollowUpAnswers,
    title: 'Interior Condition',
    subtitle: 'Condition Rating',
    options: [
      {
        value: 'excellent',
        label: 'Excellent',
        description: 'Like new condition',
        details: 'No wear, stains, or damage'
      },
      {
        value: 'good',
        label: 'Good',
        description: 'Normal wear and tear',
        details: 'Light wear, clean, well-maintained'
      },
      {
        value: 'fair',
        label: 'Fair',
        description: 'Noticeable wear',
        details: 'Moderate wear, some stains or tears'
      },
      {
        value: 'poor',
        label: 'Poor',
        description: 'Heavy wear/damage',
        details: 'Significant stains, tears, or damage'
      }
    ]
  },
  {
    key: 'brake_condition' as keyof FollowUpAnswers,
    title: 'Brake Condition',
    subtitle: 'Condition Rating',
    options: [
      {
        value: 'excellent',
        label: 'Excellent',
        description: 'Like new condition',
        details: 'Life: 80-100%, Recently serviced'
      },
      {
        value: 'good',
        label: 'Good',
        description: 'Normal wear and tear',
        details: 'Life: 40-60%, Normal brake wear'
      },
      {
        value: 'fair',
        label: 'Fair',
        description: 'Some wear present',
        details: 'Life: 20-40%, Service recommended soon'
      },
      {
        value: 'poor',
        label: 'Poor',
        description: 'Needs service',
        details: 'Life: <20%, Immediate service required'
      }
    ]
  }
];

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  const handleConditionChange = (key: keyof FollowUpAnswers, value: string) => {
    updateFormData({ [key]: value });
  };

  const getSelectedConditions = () => {
    return {
      tires: formData.tire_condition || 'good',
      exterior: formData.exterior_condition || 'good',
      interior: formData.interior_condition || 'good',
      brakes: formData.brake_condition || 'good'
    };
  };

  const selectedConditions = getSelectedConditions();

  return (
    <div className="space-y-6">
      {conditionCategories.map((category) => {
        const currentValue = formData[category.key] as string || 'good';
        
        return (
          <Card key={category.key}>
            <CardHeader>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <p className="text-sm text-gray-600">{category.subtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {category.options.map((option) => {
                  const isSelected = currentValue === option.value;
                  
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleConditionChange(category.key, option.value)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            isSelected 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'
                          }`} />
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          option.value === 'excellent' ? 'bg-green-100 text-green-700' :
                          option.value === 'good' ? 'bg-blue-100 text-blue-700' :
                          option.value === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {option.value === 'excellent' ? 'Best Value' :
                           option.value === 'good' ? 'Standard Value' :
                           option.value === 'fair' ? 'Reduced Value' : 'Lower Value'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{option.description}</div>
                      <div className="text-xs text-gray-500">{option.details}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Condition Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Condition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-blue-700">Tires</div>
              <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                selectedConditions.tires === 'excellent' ? 'bg-green-100 text-green-700' :
                selectedConditions.tires === 'good' ? 'bg-blue-100 text-blue-700' :
                selectedConditions.tires === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedConditions.tires.charAt(0).toUpperCase() + selectedConditions.tires.slice(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-blue-700">Exterior</div>
              <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                selectedConditions.exterior === 'excellent' ? 'bg-green-100 text-green-700' :
                selectedConditions.exterior === 'good' ? 'bg-blue-100 text-blue-700' :
                selectedConditions.exterior === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedConditions.exterior.charAt(0).toUpperCase() + selectedConditions.exterior.slice(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-blue-700">Interior</div>
              <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                selectedConditions.interior === 'excellent' ? 'bg-green-100 text-green-700' :
                selectedConditions.interior === 'good' ? 'bg-blue-100 text-blue-700' :
                selectedConditions.interior === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedConditions.interior.charAt(0).toUpperCase() + selectedConditions.interior.slice(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-blue-700">Brakes</div>
              <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                selectedConditions.brakes === 'excellent' ? 'bg-green-100 text-green-700' :
                selectedConditions.brakes === 'good' ? 'bg-blue-100 text-blue-700' :
                selectedConditions.brakes === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedConditions.brakes.charAt(0).toUpperCase() + selectedConditions.brakes.slice(1)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
