import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { PrioritizedValuationData } from '@/utils/followUpDataPrioritization';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ImprovementPromptsProps {
  vin: string;
  valuationData: {
    id: string;
    estimatedValue: number;
    confidenceScore: number;
    marketListings: any[];
  };
  prioritizedData?: PrioritizedValuationData;
  onRerun?: () => void;
}

export function ImprovementPrompts({ 
  vin, 
  valuationData, 
  prioritizedData,
  onRerun 
}: ImprovementPromptsProps) {
  const [isRerunning, setIsRerunning] = useState(false);
  const navigate = useNavigate();

  const followUpCompleted = prioritizedData?.followUpCompleted || false;
  const confidenceScore = valuationData.confidenceScore;
  const marketDataAvailable = valuationData.marketListings.length > 0;

  // Calculate improvement potential
  const improvementPotential = calculateImprovementPotential();
  const suggestedActions = getSuggestedActions();

  function calculateImprovementPotential(): number {
    let potential = 0;
    
    // Follow-up completion can add up to 20% confidence
    if (!followUpCompleted) potential += 20;
    
    // Market data availability adds confidence
    if (!marketDataAvailable) potential += 15;
    
    // Low-confidence fields can be improved
    if (prioritizedData) {
      const lowConfidenceFields = Object.values(prioritizedData.prioritizedFields)
        .filter(field => field.confidence === 'low').length;
      potential += lowConfidenceFields * 5;
    }

    return Math.min(potential, 35); // Cap at 35% improvement
  }

  function getSuggestedActions() {
    const actions = [];

    if (!followUpCompleted) {
      actions.push({
        id: 'complete-followup',
        title: 'Complete Follow-up Questions',
        description: 'Provide detailed vehicle information for more accurate valuation',
        impact: 'High',
        estimatedImprovement: '+15-20% confidence',
        action: () => navigate(`/valuation-followup/${vin}`),
        icon: HelpCircle,
        color: 'blue'
      });
    }

    if (!marketDataAvailable) {
      actions.push({
        id: 'search-market',
        title: 'Enhanced Market Search',
        description: 'Run expanded market search for more comparable vehicles',
        impact: 'Medium',
        estimatedImprovement: '+10-15% confidence',
        action: handleEnhancedMarketSearch,
        icon: TrendingUp,
        color: 'green'
      });
    }

    if (confidenceScore < 80) {
      actions.push({
        id: 'rerun-valuation',
        title: 'Rerun Valuation',
        description: 'Re-process with latest market data and improved algorithms',
        impact: 'Medium',
        estimatedImprovement: '+5-10% confidence',
        action: handleRerunValuation,
        icon: RotateCcw,
        color: 'purple'
      });
    }

    // Data quality improvements
    if (prioritizedData) {
      const lowConfidenceFields = Object.entries(prioritizedData.prioritizedFields)
        .filter(([_, field]) => field.confidence === 'low');
      
      if (lowConfidenceFields.length > 0) {
        actions.push({
          id: 'improve-data',
          title: 'Improve Data Quality',
          description: `Update ${lowConfidenceFields.map(([key]) => key).join(', ')} with verified information`,
          impact: 'Medium',
          estimatedImprovement: '+5-8% confidence',
          action: () => navigate(`/valuation-followup/${vin}?focus=${lowConfidenceFields[0][0]}`),
          icon: Plus,
          color: 'orange'
        });
      }
    }

    return actions;
  }

  async function handleEnhancedMarketSearch() {
    toast.info('Running enhanced market search...');
    // This would trigger an enhanced market search
    if (onRerun) {
      onRerun();
    }
  }

  async function handleRerunValuation() {
    setIsRerunning(true);
    try {
      toast.info('Rerunning valuation with latest data...');
      // This would trigger a complete valuation rerun
      if (onRerun) {
        await onRerun();
        toast.success('Valuation updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to rerun valuation. Please try again.');
    } finally {
      setIsRerunning(false);
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (IconComponent: any, color: string) => {
    const colorClasses: Record<string, string> = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    
    return <IconComponent className={`h-5 w-5 ${colorClasses[color] || 'text-gray-600'}`} />;
  };

  if (followUpCompleted && confidenceScore >= 90 && marketDataAvailable) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <div className="font-semibold text-green-800">Valuation Optimized</div>
              <div className="text-sm text-green-700">
                Your valuation is highly accurate with excellent data quality.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Improve Your Valuation
          </CardTitle>
          {improvementPotential > 0 && (
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              +{improvementPotential}% potential
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Confidence Score</span>
            <span className="text-sm text-muted-foreground">{confidenceScore}%</span>
          </div>
          <Progress value={confidenceScore} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Current</span>
            <span className="text-blue-600">
              Potential: {Math.min(confidenceScore + improvementPotential, 100)}%
            </span>
          </div>
        </div>

        {/* Improvement Actions */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            Recommended Actions
          </div>
          
          {suggestedActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <div
                key={action.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  {getActionIcon(IconComponent, action.color)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getImpactColor(action.impact)}`}
                      >
                        {action.impact} Impact
                      </Badge>
                      <span className="text-xs text-green-600 font-medium">
                        {action.estimatedImprovement}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  disabled={isRerunning && action.id === 'rerun-valuation'}
                  className="ml-3"
                >
                  {isRerunning && action.id === 'rerun-valuation' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  ) : (
                    <>
                      Start
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Additional Tips */}
        {!followUpCompleted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-800">Quick Tip</div>
                <div className="text-blue-700 mt-1">
                  Completing the follow-up questions typically improves accuracy by 15-20% 
                  and takes less than 3 minutes.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}