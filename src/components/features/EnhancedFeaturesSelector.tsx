
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FEATURE_CATEGORIES, type EnhancedFeature } from '@/data/enhanced-features-database';
import { 
  calculateEnhancedFeatureValue,
  getFeaturesByCategory,
  getImpactColor,
  getRarityColor,
  type FeatureCalculationResult
} from '@/utils/enhanced-features-calculator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, DollarSign } from 'lucide-react';

interface EnhancedFeaturesSelectorProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  baseValue?: number;
  showPricing?: boolean;
}

export function EnhancedFeaturesSelector({
  selectedFeatures,
  onFeaturesChange,
  baseValue = 25000,
  showPricing = true
}: EnhancedFeaturesSelectorProps) {
  const [activeCategory, setActiveCategory] = useState(FEATURE_CATEGORIES[0].id);

  // Calculate feature values in real-time
  const calculation = useMemo(() => 
    calculateEnhancedFeatureValue(selectedFeatures, baseValue),
    [selectedFeatures, baseValue]
  );

  const handleFeatureToggle = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      onFeaturesChange(selectedFeatures.filter(id => id !== featureId));
    } else {
      onFeaturesChange([...selectedFeatures, featureId]);
    }
  };

  const clearAllFeatures = () => {
    onFeaturesChange([]);
  };

  const getFeatureValue = (feature: EnhancedFeature): number => {
    return (baseValue * feature.percentValue) + feature.fixedValue;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with Pricing Summary */}
        {showPricing && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Features Value Calculator
                </CardTitle>
                <Button variant="outline" size="sm" onClick={clearAllFeatures}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedFeatures.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Selected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    +${Math.round(calculation.totalAdjustment).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    +${Math.round(calculation.percentageAdjustment).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">% Based</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-amber-600">
                    +${calculation.fixedAdjustment.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Fixed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Features & Options</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select the features and options included with your vehicle. Each feature shows its estimated value impact.
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {FEATURE_CATEGORIES.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-xs px-2"
                  >
                    <span className="mr-1">{category.icon}</span>
                    <span className="hidden sm:inline">{category.name.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {FEATURE_CATEGORIES.map(category => (
                <TabsContent key={category.id} value={category.id} className="mt-6">
                  <div className={`rounded-lg p-4 mb-4 border ${category.color}`}>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm">{category.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFeaturesByCategory(category.id).map(feature => {
                      const isSelected = selectedFeatures.includes(feature.id);
                      const featureValue = getFeatureValue(feature);
                      
                      return (
                        <Card 
                          key={feature.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => handleFeatureToggle(feature.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                checked={isSelected}
                                onChange={() => handleFeatureToggle(feature.id)}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-sm">{feature.name}</h4>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{feature.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                
                                <p className="text-xs text-muted-foreground mb-3">
                                  {feature.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex gap-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getRarityColor(feature.rarity)}`}
                                    >
                                      {feature.rarity}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getImpactColor(feature.impact)}`}
                                    >
                                      {feature.impact}
                                    </Badge>
                                  </div>
                                  
                                  {showPricing && (
                                    <div className="text-right">
                                      <div className="text-sm font-semibold text-green-600">
                                        +${Math.round(featureValue).toLocaleString()}
                                      </div>
                                      {feature.percentValue > 0 && (
                                        <div className="text-xs text-muted-foreground">
                                          {(feature.percentValue * 100).toFixed(1)}% + ${feature.fixedValue}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Selected Features Summary */}
        {selectedFeatures.length > 0 && showPricing && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Features Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {calculation.featureBreakdown.map(feature => (
                  <div key={feature.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{feature.name}</span>
                      <Badge variant="outline" className={`text-xs ${getRarityColor(feature.rarity)}`}>
                        {feature.rarity}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        +${Math.round(feature.calculatedValue).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(feature.percentValue * 100).toFixed(1)}% + ${feature.fixedValue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Added Value:</span>
                  <span className="text-green-600">
                    +${Math.round(calculation.totalAdjustment).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  This represents a {((calculation.totalAdjustment / baseValue) * 100).toFixed(1)}% increase in vehicle value
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
