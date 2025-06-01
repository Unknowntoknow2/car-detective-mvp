
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers, VEHICLE_FEATURE_CATEGORIES } from '@/types/follow-up-answers';
import { VehicleFormTooltip } from '@/components/form/VehicleFormToolTip';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const selectedFeatures = formData.features || [];

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    let updatedFeatures: string[];
    
    if (checked) {
      updatedFeatures = [...selectedFeatures, featureId];
    } else {
      updatedFeatures = selectedFeatures.filter(id => id !== featureId);
    }
    
    updateFormData({ features: updatedFeatures });
  };

  const getTotalValue = () => {
    return Object.values(VEHICLE_FEATURE_CATEGORIES)
      .flatMap(category => category.features)
      .filter(feature => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.impact, 0);
  };

  const getCategoryColorClasses = (color: string) => {
    const colorMap = {
      red: 'border-red-200 bg-red-50',
      blue: 'border-blue-200 bg-blue-50',
      purple: 'border-purple-200 bg-purple-50',
      green: 'border-green-200 bg-green-50',
      orange: 'border-orange-200 bg-orange-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'border-gray-200 bg-gray-50';
  };

  const getCategoryHeaderClasses = (color: string) => {
    const colorMap = {
      red: 'bg-red-500 text-white',
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      green: 'bg-green-500 text-white',
      orange: 'bg-orange-500 text-white'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500 text-white';
  };

  const getSelectedCountForCategory = (categoryKey: string) => {
    const category = VEHICLE_FEATURE_CATEGORIES[categoryKey as keyof typeof VEHICLE_FEATURE_CATEGORIES];
    return category.features.filter(feature => selectedFeatures.includes(feature.id)).length;
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">Features Selected</h3>
              <p className="text-sm text-muted-foreground">
                {selectedFeatures.length} features selected across {Object.keys(VEHICLE_FEATURE_CATEGORIES).length} categories
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                +${getTotalValue().toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Estimated Value Impact</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Categories */}
      <div className="space-y-6">
        {Object.entries(VEHICLE_FEATURE_CATEGORIES).map(([categoryKey, category]) => {
          const selectedCount = getSelectedCountForCategory(categoryKey);
          
          return (
            <Card key={categoryKey} className={`${getCategoryColorClasses(category.color)} border-2`}>
              <CardHeader className={`${getCategoryHeaderClasses(category.color)} rounded-t-lg -m-1 mb-4`}>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    {category.label}
                  </span>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {selectedCount}/{category.features.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.features.map((feature) => {
                    const isSelected = selectedFeatures.includes(feature.id);
                    
                    return (
                      <div
                        key={feature.id}
                        className={`
                          feature-card p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                          ${isSelected 
                            ? 'feature-card-selected border-primary bg-primary/10 shadow-md' 
                            : 'feature-card-unselected border-gray-200 hover:border-primary/30 hover:bg-white/80'
                          }
                        `}
                        onClick={() => handleFeatureToggle(feature.id, !isSelected)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Checkbox
                              id={feature.id}
                              checked={isSelected}
                              onCheckedChange={(checked) => handleFeatureToggle(feature.id, !!checked)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <Label 
                                htmlFor={feature.id} 
                                className="cursor-pointer font-medium text-sm leading-tight"
                              >
                                {feature.label}
                              </Label>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            <Badge 
                              variant={isSelected ? "default" : "secondary"} 
                              className="text-xs premium-price-label"
                            >
                              +${feature.impact}
                            </Badge>
                            <VehicleFormTooltip 
                              content={`This feature typically adds $${feature.impact} to vehicle value`} 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Summary */}
      {selectedFeatures.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h4 className="font-semibold text-green-800 mb-2">
                Selected Features Summary
              </h4>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {selectedFeatures.slice(0, 6).map(featureId => {
                  const feature = Object.values(VEHICLE_FEATURE_CATEGORIES)
                    .flatMap(cat => cat.features)
                    .find(f => f.id === featureId);
                  
                  return feature ? (
                    <Badge key={featureId} variant="outline" className="text-xs">
                      {feature.label}
                    </Badge>
                  ) : null;
                })}
                {selectedFeatures.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedFeatures.length - 6} more
                  </Badge>
                )}
              </div>
              <p className="text-sm text-green-700">
                Total estimated value increase: <strong>+${getTotalValue().toLocaleString()}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
