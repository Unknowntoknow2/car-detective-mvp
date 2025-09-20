import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Calculator,
  Car,
  Fuel,
  Gauge,
  MapPin,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Adjustment {
  label: string;
  amount: number;
  reason: string;
  category?: string;
}

interface InteractiveValueBreakdownProps {
  adjustments: Adjustment[];
  finalValue: number;
  confidenceScore: number;
  baseValue?: number;
}

export function InteractiveValueBreakdown({
  adjustments,
  finalValue,
  confidenceScore,
  baseValue
}: InteractiveValueBreakdownProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));
  const [showAllAdjustments, setShowAllAdjustments] = useState(false);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getAdjustmentIcon = (label: string) => {
    const iconMap: Record<string, any> = {
      'depreciation': Calculator,
      'mileage': Gauge,
      'condition': Car,
      'fuel type impact': Fuel,
      'fuel cost impact': Fuel,
      'market anchoring': MapPin,
      'market anchor': MapPin,
      'package': Package,
      'default': TrendingUp
    };
    
    const key = label.toLowerCase();
    // Check if label contains "package" for package adjustments
    if (key.includes('package')) return Package;
    return iconMap[key] || iconMap.default;
  };

  const getAdjustmentColor = (amount: number) => {
    if (amount > 0) return {
      text: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: TrendingUp
    };
    if (amount < 0) return {
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: TrendingDown
    };
    return {
      text: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: DollarSign
    };
  };

  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const calculatedBaseValue = baseValue || (finalValue - totalAdjustments);
  
  const displayedAdjustments = showAllAdjustments ? adjustments : adjustments.slice(0, 4);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Value Breakdown
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{confidenceScore}% Confidence</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('summary')}
                >
                  {expandedSections.has('summary') ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <AnimatePresence>
            {expandedSections.has('summary') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Base Value */}
                    <div className="flex justify-between items-center py-3 border-b">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Base Market Value</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-3 h-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Starting valuation before adjustments</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-semibold text-lg">
                        ${calculatedBaseValue.toLocaleString()}
                      </span>
                    </div>

                    {/* Total Adjustments */}
                    <div className="flex justify-between items-center py-3 border-b">
                      <div className="flex items-center gap-2">
                        {totalAdjustments >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className="font-medium">Total Adjustments</span>
                      </div>
                      <span className={`font-semibold text-lg ${
                        totalAdjustments >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {totalAdjustments >= 0 ? '+' : ''}${totalAdjustments.toLocaleString()}
                      </span>
                    </div>

                    {/* Final Value */}
                    <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-4 border border-green-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="font-semibold text-green-800">Final Market Value</span>
                      </div>
                      <span className="font-bold text-2xl text-green-700">
                        ${finalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Detailed Adjustments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Market Adjustments</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('adjustments')}
              >
                {expandedSections.has('adjustments') ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <AnimatePresence>
            {expandedSections.has('adjustments') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {displayedAdjustments.map((adjustment, index) => {
                      const colors = getAdjustmentColor(adjustment.amount);
                      const IconComponent = getAdjustmentIcon(adjustment.label);
                      const TrendIcon = colors.icon;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded-full bg-white/80`}>
                              <IconComponent className={`w-4 h-4 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">
                                {adjustment.label}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {adjustment.reason}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <TrendIcon className={`w-4 h-4 ${colors.text}`} />
                            <span className={`font-bold text-lg ${colors.text}`}>
                              {adjustment.amount >= 0 ? '+' : ''}${adjustment.amount.toLocaleString()}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Show More/Less Button */}
                    {adjustments.length > 4 && (
                      <div className="text-center pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllAdjustments(!showAllAdjustments)}
                        >
                          {showAllAdjustments ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              Show All ({adjustments.length - 4} more)
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Confidence Explanation */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">About This Valuation</p>
                <p className="text-muted-foreground">
                  This breakdown shows how market factors affect your vehicle's value. 
                  Higher confidence scores indicate more reliable data sources and market depth.
                </p>
                {confidenceScore < 70 && (
                  <p className="text-amber-600 font-medium">
                    💡 Complete more vehicle details to improve accuracy
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}