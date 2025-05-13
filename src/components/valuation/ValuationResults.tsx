
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Mail, Calendar, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/utils/formatters';
import { getConditionTips } from '@/utils/valuation/conditionHelpers';
import { ConditionRatingOption } from '@/types/condition';

export interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  basePrice?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  priceRange?: [number, number];
  demandFactor?: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage?: number;
    condition?: string;
  };
  valuationId?: string;
  onDownloadPdf?: () => Promise<void> | void;
  onEmailReport?: () => Promise<void> | void;
}

export function ValuationResults({
  estimatedValue,
  confidenceScore,
  basePrice,
  adjustments = [],
  priceRange,
  demandFactor,
  vehicleInfo,
  valuationId,
  onDownloadPdf,
  onEmailReport
}: ValuationResultsProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Create a condition rating option for the selected condition
  const selectedConditionRating: ConditionRatingOption = {
    id: 'condition',
    name: vehicleInfo.condition || 'Good',
    category: 'Condition',
    value: vehicleInfo.condition ? 
      ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'].indexOf(vehicleInfo.condition) : 2,
    description: getConditionTips(vehicleInfo.condition || 'Good')
  };
  
  // Create selected ratings object
  const selectedRatings: Record<string, ConditionRatingOption> = {
    condition: selectedConditionRating
  };
  
  // Calculate price range if not provided
  const calculatedPriceRange = priceRange || [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05)
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Estimated Value</span>
          <span className="text-3xl font-bold text-primary">{formatCurrency(estimatedValue)}</span>
        </CardTitle>
        <CardDescription>
          Price range: {formatCurrency(calculatedPriceRange[0])} - {formatCurrency(calculatedPriceRange[1])}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Confidence Score</span>
              <span className="text-sm">{confidenceScore}%</span>
            </div>
            <Progress value={confidenceScore} className="h-2" />
          </div>
          
          {/* Vehicle Info */}
          <div className="bg-muted/40 p-4 rounded-md">
            <h3 className="font-semibold mb-2">{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {vehicleInfo.trim && (
                <div>
                  <span className="text-muted-foreground">Trim:</span> {vehicleInfo.trim}
                </div>
              )}
              {vehicleInfo.mileage && (
                <div>
                  <span className="text-muted-foreground">Mileage:</span> {vehicleInfo.mileage.toLocaleString()} mi
                </div>
              )}
              {vehicleInfo.condition && (
                <div>
                  <span className="text-muted-foreground">Condition:</span> {vehicleInfo.condition}
                </div>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid gap-4">
                {basePrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base Value</span>
                    <span className="font-medium">{formatCurrency(basePrice)}</span>
                  </div>
                )}
                
                {demandFactor && demandFactor !== 1 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Demand</span>
                    <Badge variant={demandFactor > 1 ? "secondary" : "outline"}>
                      {demandFactor > 1 ? '+' : ''}{((demandFactor - 1) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Adjustments</span>
                  <span className="font-medium">
                    {formatCurrency(adjustments.reduce((sum, adj) => sum + (adj.impact || 0), 0))}
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="adjustments" className="space-y-4 pt-4">
              {adjustments.length > 0 ? (
                <div className="space-y-3">
                  {adjustments.map((adjustment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm">{adjustment.factor}</span>
                        {adjustment.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                {adjustment.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <Badge 
                        variant={adjustment.impact > 0 ? "secondary" : adjustment.impact < 0 ? "destructive" : "outline"}
                      >
                        {adjustment.impact > 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No adjustments applied to this valuation.</p>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Actions */}
          {(onDownloadPdf || onEmailReport) && (
            <div className="flex gap-3 pt-2 border-t">
              {onDownloadPdf && (
                <Button variant="outline" size="sm" onClick={onDownloadPdf} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
              {onEmailReport && (
                <Button variant="outline" size="sm" onClick={onEmailReport} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
