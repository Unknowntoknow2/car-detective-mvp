
import React from 'react';
import { useAccidentImpact } from '@/hooks/useAccidentImpact';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, ArrowRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface AccidentImpactCardProps {
  baseValue: number;
  accidentCount?: number;
  accidentSeverity?: 'minor' | 'moderate' | 'severe';
  accidentDescription?: string;
  vin?: string;
  valuationId?: string;
  onUpgradeToPremium?: () => void;
}

export function AccidentImpactCard({
  baseValue,
  accidentCount = 0,
  accidentSeverity = 'minor',
  accidentDescription = '',
  vin,
  valuationId,
  onUpgradeToPremium
}: AccidentImpactCardProps) {
  const { 
    percentImpact, 
    dollarImpact, 
    description, 
    recommendations, 
    isPremium,
    isLoading,
    error
  } = useAccidentImpact(
    baseValue, 
    { 
      count: accidentCount, 
      severity: accidentSeverity, 
      description: accidentDescription 
    },
    vin,
    valuationId
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing Accident Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're analyzing how accidents affect your vehicle's value...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Analysis Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={accidentCount > 0 ? "border-amber-200" : "border-green-200"}>
      <CardHeader className={accidentCount > 0 ? "bg-amber-50" : "bg-green-50"}>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {accidentCount > 0 ? (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Accident Impact Analysis</span>
              </>
            ) : (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span>Clean History Benefit</span>
              </>
            )}
          </CardTitle>
          
          {!isPremium && (
            <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
              Premium Insight Available
            </Badge>
          )}
        </div>
        <CardDescription>
          {accidentCount > 0 
            ? `How ${accidentCount} accident${accidentCount > 1 ? 's' : ''} affects your vehicle's value`
            : "How a clean history benefits your vehicle's value"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {accidentCount > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Value Impact</p>
              <p className="text-2xl font-bold text-amber-700">
                {formatCurrency(dollarImpact)}
              </p>
              <p className="text-sm text-muted-foreground">
                {(percentImpact * 100).toFixed(1)}% reduction
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Severity</p>
              <Badge className={
                accidentSeverity === 'severe' ? "bg-red-100 text-red-800" :
                accidentSeverity === 'moderate' ? "bg-amber-100 text-amber-800" :
                "bg-yellow-100 text-yellow-800"
              }>
                {accidentSeverity.charAt(0).toUpperCase() + accidentSeverity.slice(1)}
              </Badge>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Analysis</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Recommendations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      {!isPremium && onUpgradeToPremium && (
        <CardFooter className="bg-primary/5 pt-4">
          <Button 
            variant="outline" 
            className="w-full border-primary/30 text-primary" 
            onClick={onUpgradeToPremium}
          >
            <span>Get Detailed Accident Analysis</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
