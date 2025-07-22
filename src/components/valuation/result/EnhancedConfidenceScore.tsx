
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface ConfidenceBreakdown {
  vinAccuracy: number;
  marketData: number;
  fuelCostMatch: number;
  msrpQuality: number;
  overall: number;
  recommendations: string[];
}

interface EnhancedConfidenceScoreProps {
  confidenceScore: number;
  confidenceBreakdown?: ConfidenceBreakdown;
  marketListingsCount: number;
  isFallbackMethod: boolean;
  exactVinMatch: boolean;
}

export const EnhancedConfidenceScore: React.FC<EnhancedConfidenceScoreProps> = ({
  confidenceScore,
  confidenceBreakdown,
  marketListingsCount,
  isFallbackMethod,
  exactVinMatch
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getConfidenceLevel = () => {
    if (confidenceScore >= 85) return { level: 'High', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' };
    if (confidenceScore >= 70) return { level: 'Good', variant: 'secondary' as const, icon: Info, color: 'text-blue-600' };
    if (confidenceScore >= 50) return { level: 'Moderate', variant: 'secondary' as const, icon: AlertTriangle, color: 'text-yellow-600' };
    return { level: 'Low', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' };
  };

  const { level, variant, icon: IconComponent, color } = getConfidenceLevel();

  const generateConfidenceFactors = () => {
    const factors: string[] = [];
    
    if (exactVinMatch) {
      factors.push("✓ Exact VIN identification confirmed");
    } else {
      factors.push("⚠ VIN identification incomplete");
    }

    if (marketListingsCount > 0) {
      factors.push(`✓ ${marketListingsCount} comparable market listings found`);
    } else {
      factors.push("⚠ No current market listings available");
    }

    if (isFallbackMethod) {
      factors.push("⚠ Using synthetic pricing model due to limited market data");
    }

    return factors;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Confidence Assessment</span>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-auto p-0">
              <Badge variant={variant} className="flex items-center gap-1 cursor-pointer hover:bg-opacity-80">
                <IconComponent className="w-3 h-3" />
                {level} - {confidenceScore}%
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <Card className="border-0 shadow-none">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-4 h-4 ${color}`} />
                  <h4 className="font-semibold">Confidence Breakdown</h4>
                </div>
                
                {/* Detailed Breakdown */}
                {confidenceBreakdown && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>VIN Accuracy</span>
                        <span>{confidenceBreakdown.vinAccuracy}%</span>
                      </div>
                      <Progress value={confidenceBreakdown.vinAccuracy} className="h-1" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Market Data</span>
                        <span>{confidenceBreakdown.marketData}%</span>
                      </div>
                      <Progress value={confidenceBreakdown.marketData} className="h-1" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Vehicle Data Quality</span>
                        <span>{confidenceBreakdown.msrpQuality}%</span>
                      </div>
                      <Progress value={confidenceBreakdown.msrpQuality} className="h-1" />
                    </div>
                  </div>
                )}

                {/* Contributing Factors */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Contributing Factors</h5>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {generateConfidenceFactors().map((factor, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Suggestions */}
                {confidenceBreakdown?.recommendations && confidenceBreakdown.recommendations.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Improvement Suggestions</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {confidenceBreakdown.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-blue-500">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Market Data Warning */}
                {marketListingsCount === 0 && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                    <div className="flex items-center gap-1 text-amber-700">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="font-medium">Limited Market Data</span>
                    </div>
                    <p className="text-amber-600 mt-1">
                      No current market listings found. Confidence reduced and fallback pricing model applied.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
      
      <Progress 
        value={confidenceScore} 
        className={`h-2 ${confidenceScore < 50 ? 'opacity-75' : ''}`}
      />
      
      {isFallbackMethod && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Confidence reduced due to limited market data availability
        </p>
      )}
    </div>
  );
};
