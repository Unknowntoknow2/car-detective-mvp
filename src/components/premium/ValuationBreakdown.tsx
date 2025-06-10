
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ValuationHistory, ValuationBreakdownItem } from "@/types/valuation-history";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ValuationBreakdownProps {
  valuation: ValuationHistory;
  breakdown?: ValuationBreakdownItem[];
}

export const ValuationBreakdown = ({ valuation, breakdown = [] }: ValuationBreakdownProps) => {
  const getAdjustmentIcon = (adjustment: number) => {
    if (adjustment > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (adjustment < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const formatAdjustment = (adjustment: number) => {
    if (adjustment === 0) return "No impact";
    const sign = adjustment > 0 ? "+" : "";
    return `${sign}$${adjustment.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Breakdown</CardTitle>
        <CardDescription>
          Detailed breakdown of factors affecting your {valuation.vehicle_info.year} {valuation.vehicle_info.make} {valuation.vehicle_info.model} valuation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Final Valuation</p>
            <p className="text-3xl font-bold text-primary">
              ${valuation.valuation_amount.toLocaleString()}
            </p>
          </div>
        </div>

        {breakdown.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-semibold">Adjustment Factors</h4>
            {breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getAdjustmentIcon(item.adjustment)}
                  <div>
                    <p className="font-medium">{item.factor}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    item.adjustment > 0 ? 'text-green-600' : 
                    item.adjustment < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {formatAdjustment(item.adjustment)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Detailed breakdown not available for this valuation.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ValuationBreakdown;
