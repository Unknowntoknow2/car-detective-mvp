import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { ConditionSelector } from '../inputs/ConditionSelector';
import { useForm } from 'react-hook-form';

interface ConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const conditionCategories = [
  {
    key: 'tire_condition' as keyof FollowUpAnswers,
    title: 'Tire Condition',
    subtitle: 'Tread depth and overall tire health',
    options: [
      {
        value: 'excellent',
        label: 'Excellent',
        description: 'Like new condition',
        details: 'Tread: 8-10/32", No visible wear, Recently replaced',
        impact: 'Best Value',
        color: 'bg-green-50 border-green-200 text-green-800'
      },
      {
        value: 'good',
        label: 'Good', 
        description: 'Normal wear and tear',
        details: 'Tread: 4-6/32", Adequate tread, some wear visible',
        impact: 'Standard Value',
        color: 'bg-blue-50 border-blue-200 text-blue-800'
      },
      {
        value: 'fair',
        label: 'Fair',
        description: 'Noticeable wear',
        details: 'Tread: 2-4/32", Significant wear, consider replacement soon',
        impact: 'Reduced Value',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
      },
      {
        value: 'poor',
        label: 'Poor',
        description: 'Needs replacement',
        details: 'Tread: <2/32", Unsafe, immediate replacement needed',
        impact: 'Lower Value',
        color: 'bg-red-50 border-red-200 text-red-800'
      }
    ]
  },
  {
    key: 'exterior_condition' as keyof FollowUpAnswers,
    title: 'Exterior Condition',
    subtitle: 'Paint, body panels, and exterior components',  
    options: [
      {
        value: 'excellent',
        label: 'Excellent',
        description: 'Perfect condition',
        details: 'No scratches, dents, or paint issues. Showroom quality',
        impact: 'Best Value',
        color: 'bg-green-50 border-green-200 text-green-800'
      },
      {
        value: 'good',
        label: 'Good',
        description: 'Normal wear and tear',
        details: 'Minor scratches, good paint condition, well-maintained',
        impact: 'Standard Value',
        color: 'bg-blue-50 border-blue-200 text-blue-800'
      },
      {
        value: 'fair',
        label: 'Fair',
        description: 'Visible wear',
        details: 'Multiple scratches, some dents, paint fading or chips',
        impact: 'Reduced Value',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
      },
      {
        value: 'poor',
        label: 'Poor',
        description: 'Significant damage',
        details: 'Major dents, rust, extensive paint damage',
        impact: 'Lower Value',
        color: 'bg-red-50 border-red-200 text-red-800'
      }
    ]
  },
  {
    key: 'interior_condition' as keyof FollowUpAnswers,
    title: 'Interior Condition',
    subtitle: 'Seats, dashboard, and interior components',
    options: [
      {
        value: 'excellent',
        label: 'Excellent',
        description: 'Like new condition',
        details: 'No wear, stains, or damage. All components function perfectly',
        impact: 'Best Value',
        color: 'bg-green-50 border-green-200 text-green-800'
      },
      {
        value: 'good',
        label: 'Good',
        description: 'Normal wear and tear',
        details: 'Light wear, clean, well-maintained, minor scuffs',
        impact: 'Standard Value',
        color: 'bg-blue-50 border-blue-200 text-blue-800'
      },
      {
        value: 'fair',
        label: 'Fair',
        description: 'Noticeable wear',
        details: 'Moderate wear, some stains or tears, functional issues',
        impact: 'Reduced Value',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
      },
      {
        value: 'poor',
        label: 'Poor',
        description: 'Heavy wear/damage',
        details: 'Significant stains, tears, or damage. Major repairs needed',
        impact: 'Lower Value',
        color: 'bg-red-50 border-red-200 text-red-800'
      }
    ]
  },
  {
    key: 'brake_condition' as keyof FollowUpAnswers,
    title: 'Brake Condition',
    subtitle: 'Brake pads, rotors, and braking performance',
    options: [
      {
        value: 'excellent',
        label: 'Excellent',
        description: 'Like new condition',
        details: 'Life: 80-100%, Recently serviced, smooth operation',
        impact: 'Best Value',
        color: 'bg-green-50 border-green-200 text-green-800'
      },
      {
        value: 'good',
        label: 'Good',
        description: 'Normal wear and tear',
        details: 'Life: 40-60%, Normal brake wear, good performance',
        impact: 'Standard Value',
        color: 'bg-blue-50 border-blue-200 text-blue-800'
      },
      {
        value: 'fair',
        label: 'Fair',
        description: 'Some wear present',
        details: 'Life: 20-40%, Service recommended soon, minor issues',
        impact: 'Reduced Value',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
      },
      {
        value: 'poor',
        label: 'Poor',
        description: 'Needs service',
        details: 'Life: <20%, Immediate service required, safety concern',
        impact: 'Lower Value',
        color: 'bg-red-50 border-red-200 text-red-800'
      }
    ]
  }
];

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  const { watch, setValue, reset } = useForm({
    defaultValues: {
      tire_condition: formData.tire_condition || 'good',
      exterior_condition: formData.exterior_condition || 'good',
      interior_condition: formData.interior_condition || 'good',
      brake_condition: formData.brake_condition || 'good'
    }
  });

  // Sync form state with prop changes
  useEffect(() => {
    console.log('🔄 ConditionTab: Syncing form with formData:', {
      tire_condition: formData.tire_condition,
      exterior_condition: formData.exterior_condition,
      interior_condition: formData.interior_condition,
      brake_condition: formData.brake_condition
    });
    
    reset({
      tire_condition: formData.tire_condition || 'good',
      exterior_condition: formData.exterior_condition || 'good',
      interior_condition: formData.interior_condition || 'good',
      brake_condition: formData.brake_condition || 'good'
    });
  }, [formData.tire_condition, formData.exterior_condition, formData.interior_condition, formData.brake_condition, reset]);

  const handleConditionChange = (key: keyof FollowUpAnswers, value: string) => {
    console.log(`🎯 Condition change: ${String(key)} = ${value}`);
    setValue(key as any, value);
    updateFormData({ [key]: value });
  };

  const getConditionValue = (key: keyof FollowUpAnswers): string => {
    // Prioritize formData prop over internal form state
    const propValue = formData[key] as string;
    const formValue = watch(key as any);
    const result = propValue || formValue || 'good';
    console.log(`📊 getConditionValue(${String(key)}): prop=${propValue}, form=${formValue}, result=${result}`);
    return result;
  };

  // Create wrapper functions to match ConditionSelector interface
  const createSetValueWrapper = (fieldKey: keyof FollowUpAnswers) => (name: string, value: string) => {
    setValue(fieldKey as any, value);
  };

  const createWatchWrapper = (fieldKey: keyof FollowUpAnswers) => (name: string) => {
    return getConditionValue(fieldKey);
  };

  const getBadgeVariant = (value: string) => {
    switch (value) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {conditionCategories.map((category) => {
        const currentValue = getConditionValue(category.key);
        
        return (
          <Card key={category.key}>
            <CardHeader>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <p className="text-sm text-gray-600">{category.subtitle}</p>
            </CardHeader>
            <CardContent>
              <ConditionSelector
                options={category.options}
                value={currentValue}
                onChange={(value) => handleConditionChange(category.key, value)}
                title=""
                setValue={createSetValueWrapper(category.key)}
                watch={createWatchWrapper(category.key)}
              />
            </CardContent>
          </Card>
        );
      })}

      {/* Condition Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Condition Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conditionCategories.map((category) => {
              const value = getConditionValue(category.key);
              return (
                <div key={category.key} className="text-center">
                  <div className="text-sm font-medium text-blue-700 mb-1">
                    {category.title.replace(' Condition', '')}
                  </div>
                  <Badge variant={getBadgeVariant(value)} className="text-xs">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Impact:</strong> Your condition ratings directly affect your vehicle's estimated value. 
              Higher ratings result in better valuations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
