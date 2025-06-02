
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Car, Palette, Sofa, Gauge, Wrench } from 'lucide-react';

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
    selectedBg: 'bg-green-500',
    selectedText: 'text-white',
    badge: 'bg-white text-green-600'
  },
  { 
    value: 'good' as const, 
    label: 'Good', 
    description: 'Minor wear and tear',
    details: 'Well-maintained with only minor cosmetic imperfections',
    impact: 'Base Value',
    selectedBg: 'bg-blue-500',
    selectedText: 'text-white',
    badge: 'bg-white text-blue-600'
  },
  { 
    value: 'fair' as const, 
    label: 'Fair', 
    description: 'Noticeable wear',
    details: 'Visible wear and tear, may need minor repairs or maintenance',
    impact: '-15% Value',
    selectedBg: 'bg-yellow-500',
    selectedText: 'text-white',
    badge: 'bg-white text-yellow-600'
  },
  { 
    value: 'poor' as const, 
    label: 'Poor', 
    description: 'Significant issues',
    details: 'Major mechanical or cosmetic problems requiring attention',
    impact: '-25% Value',
    selectedBg: 'bg-red-500',
    selectedText: 'text-white',
    badge: 'bg-white text-red-600'
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
  },
  {
    key: 'engine_condition' as keyof FollowUpAnswers,
    title: 'Engine Condition',
    icon: Wrench,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
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
          <div key={category.key} className={`p-6 rounded-xl border-2 ${category.bgColor} ${category.borderColor}`}>
            <div className="flex items-center gap-3 mb-6">
              <category.icon className="h-6 w-6 text-gray-700" />
              <h3 className="font-semibold text-xl text-gray-900">{category.title}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {CONDITION_OPTIONS.map((option) => {
                const isSelected = currentValue === option.value;
                
                return (
                  <div
                    key={option.value}
                    onClick={() => handleConditionChange(category.key, option.value)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? `${option.selectedBg} border-transparent`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-white border-white'
                            : 'border-gray-300 bg-transparent'
                        }`}>
                          {isSelected && (
                            <div className={`w-2 h-2 rounded-full ${
                              option.value === 'excellent' ? 'bg-green-500' :
                              option.value === 'good' ? 'bg-blue-500' :
                              option.value === 'fair' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                          )}
                        </div>
                        <span className={`font-semibold text-base ${
                          isSelected ? option.selectedText : 'text-gray-700'
                        }`}>{option.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isSelected ? option.badge : 'bg-gray-100 text-gray-600'
                      }`}>
                        {option.impact}
                      </span>
                    </div>
                    <div className={`text-sm mb-2 ${
                      isSelected ? option.selectedText : 'text-gray-600'
                    }`}>{option.description}</div>
                    <div className={`text-sm ${
                      isSelected ? option.selectedText : 'text-gray-500'
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
