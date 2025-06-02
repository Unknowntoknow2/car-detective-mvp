
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Car, Palette, Sofa, Gauge } from 'lucide-react';

interface VehicleConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const CONDITION_OPTIONS = [
  { 
    value: 'excellent' as const, 
    label: 'Excellent', 
    description: 'Like new, no visible wear',
    details: 'Perfect condition, no scratches, dents, or mechanical issues',
    impact: 'Best Value'
  },
  { 
    value: 'good' as const, 
    label: 'Good', 
    description: 'Minor wear, well maintained',
    details: 'Some minor cosmetic imperfections, all systems working',
    impact: 'Standard Value'
  },
  { 
    value: 'fair' as const, 
    label: 'Fair', 
    description: 'Noticeable wear, some issues',
    details: 'Visible wear and tear, may need minor repairs',
    impact: 'Reduced Value'
  },
  { 
    value: 'poor' as const, 
    label: 'Poor', 
    description: 'Significant issues present',
    details: 'Major mechanical or cosmetic problems, needs work',
    impact: 'Lower Value'
  },
];

const CONDITION_CATEGORIES = [
  {
    key: 'condition' as keyof FollowUpAnswers,
    title: 'Overall Vehicle Condition',
    icon: Car,
    color: 'blue'
  },
  {
    key: 'exterior_condition' as keyof FollowUpAnswers,
    title: 'Exterior Condition',
    icon: Palette,
    color: 'green'
  },
  {
    key: 'interior_condition' as keyof FollowUpAnswers,
    title: 'Interior Condition',
    icon: Sofa,
    color: 'purple'
  },
  {
    key: 'tire_condition' as keyof FollowUpAnswers,
    title: 'Tire Condition',
    icon: Gauge,
    color: 'orange'
  }
];

export function VehicleConditionTab({ formData, updateFormData }: VehicleConditionTabProps) {
  const handleConditionChange = (key: keyof FollowUpAnswers, value: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {CONDITION_CATEGORIES.map((category) => {
        const currentValue = formData[category.key] as string || '';
        
        return (
          <div key={category.key}>
            <div className="flex items-center gap-2 mb-3">
              <category.icon className={`h-4 w-4 text-${category.color}-600`} />
              <h3 className="font-semibold text-sm text-gray-900">{category.title}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {CONDITION_OPTIONS.map((option) => {
                const isSelected = currentValue === option.value;
                
                return (
                  <div
                    key={option.value}
                    onClick={() => handleConditionChange(category.key, option.value)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? `bg-${category.color}-50 border-${category.color}-300`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          isSelected 
                            ? `bg-${category.color}-500 border-${category.color}-500` 
                            : 'border-gray-300'
                        }`} />
                        <span className="font-medium text-xs">{option.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        option.value === 'excellent' ? 'bg-green-100 text-green-700' :
                        option.value === 'good' ? 'bg-blue-100 text-blue-700' :
                        option.value === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {option.impact}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{option.description}</div>
                    <div className="text-xs text-gray-500">{option.details}</div>
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
