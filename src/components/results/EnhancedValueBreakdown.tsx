import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  ChevronDown,
  ChevronRight,
  Calculator,
  DollarSign
} from 'lucide-react';

interface ValueBreakdownProps {
  valuationData: {
    estimatedValue: number;
    basePriceAnchor?: number;
    adjustments?: Array<{
      type: string;
      amount: number;
      reason: string;
    }>;
  };
  marketIntelligence?: {
    medianPrice: number;
    priceRange: [number, number];
    confidence: number;
    outlierCount: number;
    adjustedPrice: number;
    sources: string[];
  };
  showDetailed?: boolean;
}

export function EnhancedValueBreakdown({ 
  valuationData, 
  marketIntelligence,
  showDetailed = true 
}: ValueBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalculationSteps, setShowCalculationSteps] = useState(false);

  const basePrice = valuationData.basePriceAnchor || marketIntelligence?.medianPrice || 0;
  const adjustments = valuationData.adjustments || [];
  const finalValue = valuationData.estimatedValue;

  // Group adjustments by type for better organization
  const groupedAdjustments = adjustments.reduce((acc, adj) => {
    const category = categorizeAdjustment(adj.type);
    if (!acc[category]) acc[category] = [];
    acc[category].push(adj);
    return acc;
  }, {} as Record<string, typeof adjustments>);

  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);

  const breakdownItems: Array<{
    label: string;
    amount: number;
    percentage: number;
    type: string;
    description: string;
    details?: typeof adjustments;
  }> = [
    {
      label: 'Base Market Value',
      amount: basePrice,
      percentage: 100,
      type: 'base',
      description: 'Market-anchored starting price based on comparable vehicles'
    }
  ];

  // Add adjustment categories
  Object.entries(groupedAdjustments).forEach(([category, categoryAdjustments]) => {
    const categoryTotal = categoryAdjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const percentage = basePrice > 0 ? Math.abs(categoryTotal / basePrice) * 100 : 0;
    
    breakdownItems.push({
      label: formatCategoryName(category),
      amount: categoryTotal,
      percentage,
      type: categoryTotal >= 0 ? 'positive' : 'negative',
      description: getCategoryDescription(category),
      details: categoryAdjustments
    });
  });

  function categorizeAdjustment(type: string): string {
    const lowercaseType = type.toLowerCase();
    if (lowercaseType.includes('mileage') || lowercaseType.includes('mile')) return 'mileage';
    if (lowercaseType.includes('condition') || lowercaseType.includes('wear')) return 'condition';
    if (lowercaseType.includes('accident') || lowercaseType.includes('damage')) return 'accident';
    if (lowercaseType.includes('modification') || lowercaseType.includes('mod')) return 'modifications';
    if (lowercaseType.includes('market') || lowercaseType.includes('demand')) return 'market';
    if (lowercaseType.includes('location') || lowercaseType.includes('zip')) return 'location';
    return 'other';
  }

  function formatCategoryName(category: string): string {
    const names: Record<string, string> = {
      mileage: 'Mileage Adjustment',
      condition: 'Condition Adjustment',
      accident: 'Accident History',
      modifications: 'Modifications',
      market: 'Market Factors',
      location: 'Location Premium',
      other: 'Other Factors'
    };
    return names[category] || category;
  }

  function getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      mileage: 'Adjustment based on vehicle mileage compared to average',
      condition: 'Adjustment based on reported vehicle condition',
      accident: 'Impact from reported accident history',
      modifications: 'Value impact from vehicle modifications',
      market: 'Regional market demand and supply factors',
      location: 'Geographic pricing variations',
      other: 'Additional factors affecting vehicle value'
    };
    return descriptions[category] || 'Other value adjustments';
  }

  const getAdjustmentIcon = (type: string) => {
    if (type === 'base') return <DollarSign className="h-4 w-4 text-blue-600" />;
    if (type === 'positive') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (type === 'negative') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getAmountColor = (type: string) => {
    if (type === 'base') return 'text-blue-600 font-semibold';
    if (type === 'positive') return 'text-green-600';
    if (type === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  const confidence = marketIntelligence?.confidence || 75;
  const confidenceColor = confidence >= 80 ? 'text-green-600' : 
                         confidence >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>Value Breakdown</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {marketIntelligence && (
              <Badge variant="outline" className={confidenceColor}>
                {confidence}% Confidence
              </Badge>
            )}
            {showDetailed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Base Value</div>
            <div className="text-lg font-semibold">${basePrice.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Adjustments</div>
            <div className={`text-lg font-semibold ${totalAdjustments >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalAdjustments >= 0 ? '+' : ''}${totalAdjustments.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Final Value</div>
            <div className="text-lg font-bold text-primary">${finalValue.toLocaleString()}</div>
          </div>
        </div>

        {/* Value Progression */}
        <div className="space-y-3">
          {breakdownItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                {getAdjustmentIcon(item.type)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${getAmountColor(item.type)}`}>
                  {item.type === 'base' ? '' : item.amount >= 0 ? '+' : ''}
                  ${Math.abs(item.amount).toLocaleString()}
                </div>
                {item.type !== 'base' && item.percentage > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {item.percentage.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Market Intelligence */}
        {marketIntelligence && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Market Intelligence</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Price Range:</span>
                <span className="ml-2 font-medium">
                  ${marketIntelligence.priceRange[0].toLocaleString()} - ${marketIntelligence.priceRange[1].toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Market Median:</span>
                <span className="ml-2 font-medium">${marketIntelligence.medianPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Data Sources:</span>
                <span className="ml-2 font-medium">{marketIntelligence.sources.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Outliers Filtered:</span>
                <span className="ml-2 font-medium">{marketIntelligence.outlierCount}</span>
              </div>
            </div>
            
            {/* Confidence Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Confidence Level</span>
                <span className={confidenceColor}>{confidence}%</span>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>
          </div>
        )}

        {/* Detailed Breakdown */}
        {isExpanded && showDetailed && (
          <div className="border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalculationSteps(!showCalculationSteps)}
              className="mb-3"
            >
              {showCalculationSteps ? 'Hide' : 'Show'} Calculation Steps
            </Button>
            
            {showCalculationSteps && (
              <div className="space-y-2 text-sm bg-muted p-3 rounded-lg">
                <div className="font-medium">Calculation Process:</div>
                <div>1. Base value determined from market comparables</div>
                <div>2. Mileage adjustment applied based on age and usage</div>
                <div>3. Condition factor applied based on reported/assessed condition</div>
                <div>4. Regional market adjustments applied</div>
                <div>5. Additional factors (accidents, modifications) considered</div>
                <div className="font-medium pt-2">
                  Final Result: ${basePrice.toLocaleString()} + ({totalAdjustments >= 0 ? '+' : ''}${totalAdjustments.toLocaleString()}) = ${finalValue.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}