
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  EnhancedFeature, 
  ENHANCED_FEATURES_DATABASE, 
  FEATURE_CATEGORIES 
} from '@/data/enhanced-features-database';
import { calculateEnhancedFeatureValue, getImpactColor, getRarityColor } from '@/utils/enhanced-features-calculator';

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
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    onFeaturesChange(updatedFeatures);
  };

  const calculateTotalValue = () => {
    const selectedFeatureObjects = ENHANCED_FEATURES_DATABASE.filter(f => 
      selectedFeatures.includes(f.id)
    );
    return calculateEnhancedFeatureValue(selectedFeatureObjects, baseValue);
  };

  const totalValue = calculateTotalValue();

  // Show override toggle if detected features exist
  if (overrideDetected) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-lg font-medium text-blue-900">
              🤖 AI detected vehicle features automatically
            </div>
            <p className="text-blue-700">
              Our AI has identified your vehicle's features. You can review and edit them if needed.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {/* Handle override */}}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Review & Edit Features
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {showPricing && totalValue.totalAdjustment > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-800">Total Feature Value:</span>
              <span className="text-lg font-bold text-green-600">
                +${totalValue.totalAdjustment.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-green-600 mt-1">
              {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(FEATURE_CATEGORIES).map(([categoryId, categoryInfo]) => {
          const categoryFeatures = ENHANCED_FEATURES_DATABASE.filter(f => f.category === categoryId);
          const isExpanded = expandedCategories[categoryId] ?? false;
          const selectedInCategory = categoryFeatures.filter(f => selectedFeatures.includes(f.id)).length;

          return (
            <Card key={categoryId} className="hover:shadow-md transition-shadow">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleCategory(categoryId)}
              >
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{categoryInfo.icon}</span>
                    <span>{categoryInfo.name}</span>
                    {selectedInCategory > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedInCategory}
                      </Badge>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {categoryFeatures.map((feature) => {
                      const isSelected = selectedFeatures.includes(feature.id);
                      const featureValue = calculateEnhancedFeatureValue([feature], baseValue);
                      
                      return (
                        <div
                          key={feature.id}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-300 bg-blue-50'
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
                                {showPricing && (
                                  <span className="text-sm text-green-600 font-medium">
                                    +${featureValue.totalAdjustment.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
