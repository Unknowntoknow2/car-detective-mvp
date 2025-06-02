
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Car, Palette, Sofa, Gauge } from 'lucide-react';

interface ConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const CONDITION_OPTIONS = [
  { 
    value: 'excellent' as const, 
    label: 'Excellent', 
    description: 'Like new condition',
    details: 'Perfect or near-perfect condition with no visible defects',
    impact: '+10% Value',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    textColor: 'text-green-800',
    iconColor: 'bg-green-500'
  },
  { 
    value: 'good' as const, 
    label: 'Good', 
    description: 'Minor wear and tear',
    details: 'Well-maintained with only minor cosmetic imperfections',
    impact: 'Base Value',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-800',
    iconColor: 'bg-blue-500'
  },
  { 
    value: 'fair' as const, 
    label: 'Fair', 
    description: 'Noticeable wear',
    details: 'Visible wear and tear, may need minor repairs or maintenance',
    impact: '-15% Value',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-800',
    iconColor: 'bg-yellow-500'
  },
  { 
    value: 'poor' as const, 
    label: 'Poor', 
    description: 'Significant issues',
    details: 'Major mechanical or cosmetic problems requiring attention',
    impact: '-25% Value',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    textColor: 'text-red-800',
    iconColor: 'bg-red-500'
  },
];

const CONDITION_CATEGORIES = [
  {
    key: 'condition' as keyof FollowUpAnswers,
    title: 'Overall Vehicle Condition',
    icon: Car,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    key: 'exterior_condition' as keyof FollowUpAnswers,
    title: 'Exterior Condition',
    icon: Palette,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    key: 'interior_condition' as keyof FollowUpAnswers,
    title: 'Interior Condition',
    icon: Sofa,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    key: 'tire_condition' as keyof FollowUpAnswers,
    title: 'Tire Condition',
    icon: Gauge,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
];

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  const handleConditionChange = (key: keyof FollowUpAnswers, value: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {CONDITION_CATEGORIES.map((category) => {
        const currentValue = formData[category.key] as string || '';
        
        return (
          <div key={category.key} className={`p-4 rounded-lg border ${category.bgColor} ${category.borderColor}`}>
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="h-5 w-5 text-gray-700" />
              <h3 className="font-semibold text-lg text-gray-900">{category.title}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {CONDITION_OPTIONS.map((option) => {
                const isSelected = currentValue === option.value;
                
                return (
                  <div
                    key={option.value}
                    onClick={() => handleConditionChange(category.key, option.value)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? `${option.bgColor} ${option.borderColor}`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          isSelected 
                            ? option.iconColor
                            : 'bg-gray-300'
                        }`} />
                        <span className={`font-semibold text-sm ${
                          isSelected ? option.textColor : 'text-gray-900'
                        }`}>{option.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        option.value === 'excellent' ? 'bg-green-100 text-green-700' :
                        option.value === 'good' ? 'bg-blue-100 text-blue-700' :
                        option.value === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {option.impact}
                      </span>
                    </div>
                    <div className={`text-sm mb-2 ${
                      isSelected ? option.textColor : 'text-gray-700'
                    }`}>{option.description}</div>
                    <div className={`text-xs ${
                      isSelected ? option.textColor : 'text-gray-500'
                    }`}>{option.details}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
