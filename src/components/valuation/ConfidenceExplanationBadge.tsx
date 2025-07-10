import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircle, AlertCircle, XCircle, Info, RefreshCw } from 'lucide-react';

interface ConfidenceExplanationBadgeProps {
  confidenceScore: number;
  marketSearchStatus: "success" | "fallback" | "error";
  listingCount: number;
  sources: string[];
  onRetrySearch?: () => void;
}

export function ConfidenceExplanationBadge({
  confidenceScore,
  marketSearchStatus,
  listingCount,
  sources,
  onRetrySearch
}: ConfidenceExplanationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getConfidenceLevel = () => {
    if (confidenceScore >= 80) return { level: 'High', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' };
    if (confidenceScore >= 60) return { level: 'Medium', variant: 'secondary' as const, icon: AlertCircle, color: 'text-yellow-600' };
    return { level: 'Low', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' };
  };

  const generateExplanation = () => {
    const reasons: string[] = [];
    const suggestions: string[] = [];

    // Market data analysis
    if (marketSearchStatus === 'success' && listingCount > 0) {
      reasons.push(`Found ${listingCount} comparable market listings`);
    } else if (marketSearchStatus === 'fallback') {
      reasons.push('No live market listings found');
      suggestions.push('Retry search for updated market data');
    } else if (marketSearchStatus === 'error') {
      reasons.push('Market search encountered an error');
      suggestions.push('Try again to fetch live market data');
    }

    // Data sources analysis
    if (sources.includes('msrp_db_lookup')) {
      reasons.push('Using verified MSRP database');
    } else {
      reasons.push('Using estimated MSRP values');
      suggestions.push('VIN decoding may improve accuracy');
    }

    if (sources.includes('package_detection')) {
      reasons.push('Detected valuable packages and features');
    }

    if (sources.includes('openai_market_search')) {
      reasons.push('Enhanced with AI market intelligence');
    }

    // Confidence-specific suggestions
    if (confidenceScore < 70) {
      if (!suggestions.includes('Retry search for updated market data')) {
        suggestions.push('Add more vehicle details for improved accuracy');
      }
      if (listingCount === 0) {
        suggestions.push('Expand search radius for more comparisons');
      }
    }

    return { reasons, suggestions };
  };

  const { level, variant, icon: IconComponent, color } = getConfidenceLevel();
  const { reasons, suggestions } = generateExplanation();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0">
          <Badge variant={variant} className="flex items-center gap-1 cursor-pointer hover:bg-opacity-80">
            <IconComponent className="w-3 h-3" />
            {level} Confidence {confidenceScore}%
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <Card className="border-0 shadow-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <IconComponent className={`w-4 h-4 ${color}`} />
              <h4 className="font-semibold">Confidence Analysis</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Contributing Factors
                </h5>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-primary">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {suggestions.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Suggestions</h5>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-yellow-500">→</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(marketSearchStatus === 'fallback' || marketSearchStatus === 'error') && onRetrySearch && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    onRetrySearch();
                    setIsOpen(false);
                  }}
                  className="w-full mt-3 flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry Market Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}