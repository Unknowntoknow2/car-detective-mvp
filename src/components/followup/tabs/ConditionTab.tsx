
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Car, Palette, Sofa, Gauge, Wrench, AlertTriangle } from 'lucide-react';

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
    color: 'green'
  },
  { 
    value: 'good' as const, 
    label: 'Good', 
    description: 'Minor wear and tear',
    details: 'Well-maintained with only minor cosmetic imperfections',
    impact: 'Base Value',
    color: 'blue'
  },
  { 
    value: 'fair' as const, 
    label: 'Fair', 
    description: 'Noticeable wear',
    details: 'Visible wear and tear, may need minor repairs or maintenance',
    impact: '-15% Value',
    color: 'yellow'
  },
  { 
    value: 'poor' as const, 
    label: 'Poor', 
    description: 'Significant issues',
    details: 'Major mechanical or cosmetic problems requiring attention',
    impact: '-25% Value',
    color: 'red'
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

const MECHANICAL_CONDITIONS = [
  {
    key: 'engine_condition',
    title: 'Engine Condition',
    icon: Wrench,
    options: [
      { value: 'excellent', label: 'Runs Perfect', description: 'No issues, smooth operation' },
      { value: 'good', label: 'Runs Well', description: 'Minor maintenance needed' },
      { value: 'fair', label: 'Some Issues', description: 'Noticeable problems, needs work' },
      { value: 'poor', label: 'Major Problems', description: 'Significant mechanical issues' }
    ]
  },
  {
    key: 'transmission_condition',
    title: 'Transmission Condition',
    icon: Wrench,
    options: [
      { value: 'excellent', label: 'Smooth Shifts', description: 'Perfect operation' },
      { value: 'good', label: 'Good Operation', description: 'Minor hesitation or delay' },
      { value: 'fair', label: 'Some Slipping', description: 'Occasional rough shifts' },
      { value: 'poor', label: 'Major Issues', description: 'Significant transmission problems' }
    ]
  }
];

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  const handleConditionChange = (key: keyof FollowUpAnswers, value: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Main Condition Categories */}
      {CONDITION_CATEGORIES.map((category) => {
        const currentValue = formData[category.key] as string || '';
        
        return (
          <div key={category.key} className={`p-4 rounded-lg border ${category.bgColor} ${category.borderColor}`}>
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-lg text-gray-900">{category.title}</h3>
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
                        ? `bg-${option.color}-50 border-${option.color}-300`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          isSelected 
                            ? `bg-${option.color}-500 border-${option.color}-500` 
                            : 'border-gray-300'
                        }`} />
                        <span className="font-medium text-sm">{option.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded bg-${option.color}-100 text-${option.color}-700`}>
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

      {/* Mechanical Conditions */}
      {MECHANICAL_CONDITIONS.map((mechanical) => {
        const currentValue = formData[mechanical.key as keyof FollowUpAnswers] as string || '';
        
        return (
          <div key={mechanical.key} className="p-4 rounded-lg border bg-gray-50 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <mechanical.icon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-lg text-gray-900">{mechanical.title}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {mechanical.options.map((option) => {
                const isSelected = currentValue === option.value;
                
                return (
                  <div
                    key={option.value}
                    onClick={() => handleConditionChange(mechanical.key as keyof FollowUpAnswers, option.value as any)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`} />
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Additional Notes */}
      <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <h3 className="font-medium text-sm text-gray-900">Additional Notes</h3>
        </div>
        <textarea
          value={formData.additional_notes || ''}
          onChange={(e) => updateFormData({ additional_notes: e.target.value })}
          placeholder="Add any additional details about your vehicle's condition..."
          rows={3}
          className="w-full text-xs p-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
    </div>
  );
}
