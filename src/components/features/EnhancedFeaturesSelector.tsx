
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ENHANCED_FEATURES, FEATURE_CATEGORIES, type EnhancedFeature } from '@/data/enhanced-features-database';
import { calculateEnhancedFeatureValue, getImpactColor, getRarityColor } from '@/utils/enhanced-features-calculator';

interface EnhancedFeaturesSelectorProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  baseValue: number;
  showPricing?: boolean;
}

export function EnhancedFeaturesSelector({ 
  selectedFeatures, 
  onFeaturesChange, 
  baseValue,
  showPricing = true 
}: EnhancedFeaturesSelectorProps) {
  const handleFeatureToggle = (featureId: string) => {
    const isSelected = selectedFeatures.includes(featureId);
    if (isSelected) {
      onFeaturesChange(selectedFeatures.filter(id => id !== featureId));
    } else {
      onFeaturesChange([...selectedFeatures, featureId]);
    }
  };

  const calculation = calculateEnhancedFeatureValue(selectedFeatures, baseValue);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (decimal: number) => {
    return `${(decimal * 100).toFixed(1)}%`;
  };

  const renderFeatureCard = (feature: EnhancedFeature) => {
    const isSelected = selectedFeatures.includes(feature.id);
    const percentValue = baseValue * feature.percentValue;
    const totalValue = percentValue + feature.fixedValue;

    return (
      <div
        key={feature.id}
        className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected 
            ? 'border-primary bg-primary/5 shadow-sm' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleFeatureToggle(feature.id)}
      >
        {/* Selection indicator */}
        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected 
            ? 'bg-primary border-primary text-white' 
            : 'border-gray-300'
        }`}>
          {isSelected && <Check className="w-3 h-3" />}
        </div>

        {/* Feature name */}
        <h4 className="font-medium text-sm mb-2 pr-8">{feature.name}</h4>

        {/* Impact and rarity badges */}
        <div className="flex items-center gap-2 mb-2">
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-0 ${getImpactColor(feature.impact)}`}
          >
            {feature.impact} impact
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-0 border ${getRarityColor(feature.rarity)}`}
          >
            {feature.rarity}
          </Badge>
        </div>

        {/* Pricing information */}
        {showPricing && (
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">+{formatPercentage(feature.percentValue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fixed:</span>
              <span className="font-medium">+{formatCurrency(feature.fixedValue)}</span>
            </div>
            <div className="flex justify-between border-t pt-1 font-medium">
              <span>Total Value:</span>
              <span className="text-green-600">+{formatCurrency(totalValue)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      {showPricing && selectedFeatures.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-900">Features Value Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Selected Features</div>
                <div className="font-bold text-lg">{selectedFeatures.length}</div>
              </div>
              <div>
                <div className="text-gray-600">Percentage Boost</div>
                <div className="font-bold text-lg text-blue-600">
                  +{formatPercentage(calculation.percentageAdjustment / baseValue)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Fixed Value</div>
                <div className="font-bold text-lg text-green-600">
                  +{formatCurrency(calculation.fixedAdjustment)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Total Adjustment</div>
                <div className="font-bold text-xl text-green-700">
                  +{formatCurrency(calculation.cappedAdjustment)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Categories */}
      <div className="space-y-6">
        {FEATURE_CATEGORIES.map(category => {
          const categoryFeatures = ENHANCED_FEATURES.filter(f => f.category === category.id);
          const selectedInCategory = categoryFeatures.filter(f => selectedFeatures.includes(f.id)).length;

          return (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    {category.name}
                  </CardTitle>
                  {selectedInCategory > 0 && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {selectedInCategory} selected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryFeatures.map(renderFeatureCard)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Clear Selection Button */}
      {selectedFeatures.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={() => onFeaturesChange([])}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All Selections ({selectedFeatures.length})
          </Button>
        </div>
      )}
    </div>
  );
}
