
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  ENHANCED_FEATURES,
  FEATURE_CATEGORIES,
  type EnhancedFeature
} from '@/data/enhanced-features-database';
import { calculateEnhancedFeatureValue } from '@/utils/enhanced-features-calculator';

interface EnhancedFeaturesSelectorProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  baseValue: number;
  showPricing?: boolean;
  overrideDetected?: boolean;
}

export function EnhancedFeaturesSelector({
  selectedFeatures,
  onFeaturesChange,
  baseValue,
  showPricing = true,
  overrideDetected = false
}: EnhancedFeaturesSelectorProps) {
  const [showOverride, setShowOverride] = React.useState(overrideDetected);

  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    onFeaturesChange(updatedFeatures);
  };

  const getCategoryFeatures = (categoryId: string) => {
    return ENHANCED_FEATURES.filter((f: EnhancedFeature) => f.category === categoryId);
  };

  const calculateCategoryValue = (categoryId: string) => {
    const categoryFeatures = getCategoryFeatures(categoryId);
    const selectedCategoryFeatures = selectedFeatures.filter(id => 
      categoryFeatures.some((f: EnhancedFeature) => f.id === id)
    );
    return calculateEnhancedFeatureValue(selectedCategoryFeatures, baseValue);
  };

  const totalValue = calculateEnhancedFeatureValue(selectedFeatures, baseValue);

  // Smart UX: Show override toggle if AI/VIN detection found features
  if (overrideDetected && !showOverride) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Vehicle Features Detected
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Auto-Detected
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            We've automatically detected your vehicle's features from VIN data and photos.
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => setShowOverride(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Edit or Override Detected Features
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {showPricing && totalValue.totalAdjustment > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800">
                Total Features Value
              </h3>
              <p className="text-2xl font-bold text-green-900">
                +${totalValue.totalAdjustment.toLocaleString()}
              </p>
              <p className="text-sm text-green-700">
                {selectedFeatures.length} features selected
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {FEATURE_CATEGORIES.map(category => {
          const categoryFeatures = getCategoryFeatures(category.id);
          const categoryValue = calculateCategoryValue(category.id);
          const selectedCount = selectedFeatures.filter(id => 
            categoryFeatures.some((f: EnhancedFeature) => f.id === id)
          ).length;

          return (
            <Card key={category.id} className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    {category.name}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedCount}
                      </Badge>
                    )}
                    {showPricing && categoryValue.totalAdjustment > 0 && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        +${categoryValue.totalAdjustment.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryFeatures.map((feature: EnhancedFeature) => {
                  const isSelected = selectedFeatures.includes(feature.id);
                  const featureValue = calculateEnhancedFeatureValue([feature.id], baseValue);
                  
                  return (
                    <div
                      key={feature.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleFeatureToggle(feature.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleFeatureToggle(feature.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <Label className="font-medium cursor-pointer text-sm">
                            {feature.name}
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={feature.impact === 'high' ? 'default' : feature.impact === 'medium' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {feature.impact}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                feature.rarity === 'luxury' ? 'border-purple-300 text-purple-700' :
                                feature.rarity === 'premium' ? 'border-amber-300 text-amber-700' :
                                'border-gray-300 text-gray-700'
                              }`}
                            >
                              {feature.rarity}
                            </Badge>
                            {showPricing && (
                              <span className="text-xs text-green-600 font-medium">
                                +${featureValue.totalAdjustment.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
