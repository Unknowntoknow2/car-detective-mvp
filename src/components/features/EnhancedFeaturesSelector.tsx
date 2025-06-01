
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  ENHANCED_FEATURES, 
  FEATURE_CATEGORIES, 
  type EnhancedFeature, 
  type FeatureCategory 
} from '@/data/enhanced-features-database';
import { 
  calculateEnhancedFeatureValue, 
  getImpactColor, 
  getRarityColor 
} from '@/utils/enhanced-features-calculator';

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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['safety', 'technology']);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Group features by category
  const groupedFeatures = useMemo(() => {
    const groups: Record<string, EnhancedFeature[]> = {};
    ENHANCED_FEATURES.forEach(feature => {
      if (!groups[feature.category]) {
        groups[feature.category] = [];
      }
      groups[feature.category].push(feature);
    });
    return groups;
  }, []);

  // Calculate total value adjustment
  const totalCalculation = useMemo(() => {
    return calculateEnhancedFeatureValue(selectedFeatures, baseValue);
  }, [selectedFeatures, baseValue]);

  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    onFeaturesChange(updatedFeatures);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const renderFeatureCard = (feature: EnhancedFeature) => {
    const isSelected = selectedFeatures.includes(feature.id);
    const featureCalculation = calculateEnhancedFeatureValue([feature.id], baseValue);
    const impactColorClass = getImpactColor(feature.impact);
    const rarityColorClass = getRarityColor(feature.rarity);

    return (
      <div
        key={feature.id}
        className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-sm'
            : 'border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => handleFeatureToggle(feature.id)}
      >
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={isSelected}
            onChange={() => handleFeatureToggle(feature.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <Label className="font-medium text-sm cursor-pointer block">
              {feature.name}
            </Label>
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={impactColorClass}>
                {feature.impact}
              </Badge>
              
              <Badge variant="outline" className={rarityColorClass}>
                {feature.rarity}
              </Badge>
              
              {showPricing && (
                <div className="text-sm font-medium text-green-600">
                  +${featureCalculation.totalAdjustment.toLocaleString()}
                </div>
              )}
            </div>

            {showPricing && (
              <div className="text-xs text-gray-500 mt-1">
                {feature.percentValue > 0 && `${(feature.percentValue * 100).toFixed(1)}%`}
                {feature.percentValue > 0 && feature.fixedValue > 0 && ' + '}
                {feature.fixedValue > 0 && `$${feature.fixedValue.toLocaleString()}`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCategory = (category: FeatureCategory) => {
    const categoryFeatures = groupedFeatures[category.id] || [];
    const isExpanded = expandedCategories.includes(category.id);
    const selectedInCategory = categoryFeatures.filter(f => selectedFeatures.includes(f.id)).length;

    if (categoryFeatures.length === 0) return null;

    return (
      <Card key={category.id} className="overflow-hidden">
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleCategory(category.id)}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedInCategory > 0 && (
                    <Badge variant="secondary">
                      {selectedInCategory} selected
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryFeatures.map(renderFeatureCard)}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  // Determine which categories to show
  const categoriesToShow = showAllCategories 
    ? FEATURE_CATEGORIES 
    : FEATURE_CATEGORIES.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Total Value Summary */}
      {showPricing && totalCalculation.totalAdjustment > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Feature Value</h3>
                <p className="text-sm text-gray-600">
                  {totalCalculation.featureBreakdown.length} features selected
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  +${totalCalculation.totalAdjustment.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {((totalCalculation.totalAdjustment / baseValue) * 100).toFixed(1)}% of base value
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Override Detection Notice */}
      {overrideDetected && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800">
              <span>⚠️</span>
              <span className="text-sm font-medium">
                Override mode: You can modify features that were detected automatically
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Categories */}
      <div className="space-y-4">
        {categoriesToShow.map(renderCategory)}
      </div>

      {/* Show More/Less Categories */}
      {!showAllCategories && FEATURE_CATEGORIES.length > 6 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllCategories(true)}
            className="w-full"
          >
            Show All Categories ({FEATURE_CATEGORIES.length - 6} more)
          </Button>
        </div>
      )}

      {showAllCategories && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllCategories(false)}
            className="w-full"
          >
            Show Fewer Categories
          </Button>
        </div>
      )}
    </div>
  );
}
