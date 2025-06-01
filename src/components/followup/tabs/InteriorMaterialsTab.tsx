
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { getFeaturesByCategory, calculateEnhancedFeatureValue } from '@/utils/enhanced-features-calculator';

interface InteriorMaterialsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  baseValue: number;
}

export function InteriorMaterialsTab({ formData, updateFormData, baseValue }: InteriorMaterialsTabProps) {
  const interiorFeatures = getFeaturesByCategory('interior');
  const selectedFeatures = formData.features || [];

  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    updateFormData({ features: updatedFeatures });
  };

  const categoryValue = calculateEnhancedFeatureValue(
    selectedFeatures.filter(id => interiorFeatures.some(f => f.id === id)),
    baseValue
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🪑</span>
            Interior Materials
          </CardTitle>
          {categoryValue.totalAdjustment > 0 && (
            <Badge variant="secondary">
              +${categoryValue.totalAdjustment.toLocaleString()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interiorFeatures.map((feature) => {
            const isSelected = selectedFeatures.includes(feature.id);
            const featureValue = calculateEnhancedFeatureValue([feature.id], baseValue);
            
            return (
              <div
                key={feature.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFeatureToggle(feature.id)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleFeatureToggle(feature.id)}
                  />
                  <div className="flex-1">
                    <Label className="font-medium cursor-pointer">
                      {feature.name}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={feature.impact === 'high' ? 'default' : feature.impact === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {feature.impact}
                      </Badge>
                      <span className="text-sm text-green-600 font-medium">
                        +${featureValue.totalAdjustment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
