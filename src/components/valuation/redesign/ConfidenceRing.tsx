import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, TrendingUp, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfidenceFactors {
  vinAccuracy?: number;
  marketData?: number;
  fuelCostMatch?: number;
  msrpQuality?: number;
}

interface ConfidenceRingProps {
  score: number;
  factors?: ConfidenceFactors;
  recommendations?: string[];
  onImproveClick?: () => void;
}

export function ConfidenceRing({
  score,
  factors,
  recommendations = [],
  onImproveClick
}: ConfidenceRingProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return {
      gradient: 'from-emerald-500 to-green-500',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      ring: 'stroke-emerald-500'
    };
    if (score >= 70) return {
      gradient: 'from-blue-500 to-indigo-500',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      ring: 'stroke-blue-500'
    };
    if (score >= 50) return {
      gradient: 'from-amber-500 to-orange-500',
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'stroke-amber-500'
    };
    return {
      gradient: 'from-red-500 to-pink-500',
      text: 'text-red-600',
      bg: 'bg-red-50',
      ring: 'stroke-red-500'
    };
  };

  const getScoreDescription = (score: number) => {
    if (score >= 85) return 'High data quality with excellent market coverage';
    if (score >= 70) return 'Good data quality with solid market insights';
    if (score >= 50) return 'Moderate confidence with limited market data';
    return 'Lower confidence due to data limitations';
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const defaultFactors = {
    vinAccuracy: factors?.vinAccuracy ?? 85,
    marketData: factors?.marketData ?? score >= 70 ? 75 : 45,
    fuelCostMatch: factors?.fuelCostMatch ?? 90,
    msrpQuality: factors?.msrpQuality ?? score >= 80 ? 85 : 60
  };

  return (
    <TooltipProvider>
      <Card className={`${colors.bg} border-2 border-current ${colors.text} relative overflow-hidden`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {/* Confidence Ring */}
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="opacity-20"
                />
                
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={colors.ring}
                />
              </svg>
              
              {/* Score in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <div className={`text-2xl font-bold ${colors.text}`}>{score}%</div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </motion.div>
              </div>
            </div>

            {/* Info and Actions */}
            <div className="flex-1 ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">Data Confidence Score</h3>
                <p className="text-sm text-muted-foreground">
                  {getScoreDescription(score)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="text-xs"
                >
                  <Info className="w-3 h-3 mr-1" />
                  {showBreakdown ? 'Hide' : 'Show'} Breakdown
                </Button>

                {score < 70 && onImproveClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onImproveClick}
                    className="text-xs"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Improve
                  </Button>
                )}
              </div>

              {/* Confidence Level Badge */}
              <div className="flex items-center gap-2">
                {score >= 85 && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                {score >= 70 && score < 85 && <Info className="w-4 h-4 text-blue-600" />}
                {score >= 50 && score < 70 && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {score < 50 && <HelpCircle className="w-4 h-4 text-red-600" />}
                
                <Badge variant="outline" className="text-xs">
                  {score >= 85 && 'Excellent'}
                  {score >= 70 && score < 85 && 'Good'}
                  {score >= 50 && score < 70 && 'Fair'}
                  {score < 50 && 'Limited'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          {showBreakdown && (
            <motion.div 
              className="mt-6 pt-4 border-t border-current/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-medium text-sm mb-3">Confidence Factors</h4>
              <div className="space-y-2">
                {Object.entries(defaultFactors).map(([key, value]) => {
                  const labels = {
                    vinAccuracy: 'VIN Data Quality',
                    marketData: 'Market Data Depth',
                    fuelCostMatch: 'Fuel Cost Accuracy',
                    msrpQuality: 'MSRP Reliability'
                  };
                  
                  return (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{labels[key as keyof typeof labels]}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-current/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-current rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                          />
                        </div>
                        <span className="font-medium w-8 text-right">{value}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && score < 70 && (
                <div className="mt-4 p-3 bg-background/50 rounded-lg">
                  <h5 className="font-medium text-xs text-muted-foreground mb-2">
                    💡 Improve Your Confidence Score
                  </h5>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}